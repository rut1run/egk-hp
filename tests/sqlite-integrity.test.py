import sqlite3, pathlib, unittest

class DataIntegrity(unittest.TestCase):
    def setUp(self):
        self.db = sqlite3.connect(':memory:')
        self.db.execute('PRAGMA foreign_keys=ON')
        for path in sorted(pathlib.Path('drizzle').glob('*.sql')):
            self.db.executescript(path.read_text())
    def account(self, identity='admin-1', username='owner', email='owner@example.invalid'):
        self.db.execute('INSERT INTO accounts(id,username,display_name,email,password_hash,role,created_at) VALUES(?,?,?,?,?,?,?)',(identity,username,'Owner',email,'test-hash','admin',1))
    def test_duplicate_usernames_cannot_create_another_identity(self):
        self.account()
        with self.assertRaises(sqlite3.IntegrityError): self.account('admin-2','owner','second@example.invalid')
    def test_bootstrap_collision_rolls_back_entire_transaction(self):
        self.db.execute("INSERT INTO site_settings VALUES('admin_bootstrap','existing')")
        self.db.commit()
        with self.assertRaises(sqlite3.IntegrityError):
            with self.db:
                self.account()
                self.db.execute("INSERT INTO site_settings VALUES('admin_bootstrap','admin-1')")
        self.assertEqual(self.db.execute('SELECT count(*) FROM accounts').fetchone()[0],0)
    def test_account_deletion_revokes_sessions(self):
        self.account()
        self.db.execute("INSERT INTO account_sessions VALUES('hashed-token','admin-1',9999999999999)")
        self.db.execute("DELETE FROM accounts WHERE id='admin-1'")
        self.assertEqual(self.db.execute('SELECT count(*) FROM account_sessions').fetchone()[0],0)
    def test_content_slug_is_unique_within_kind(self):
        row=('news','sample','{}',1,1,'admin-1')
        self.db.execute('INSERT INTO content_records VALUES(?,?,?,?,?,?)',row)
        with self.assertRaises(sqlite3.IntegrityError): self.db.execute('INSERT INTO content_records VALUES(?,?,?,?,?,?)',row)
        self.db.execute('INSERT INTO content_records VALUES(?,?,?,?,?,?)',('members','sample','{}',1,1,'admin-1'))
        self.assertEqual(self.db.execute('SELECT count(*) FROM content_records').fetchone()[0],2)

    def test_user_records_are_isolated_and_unique(self):
        self.account()
        self.account('member-1','member','member@example.invalid')
        self.db.execute("INSERT INTO account_favorites VALUES('admin-1','member-a')")
        self.db.execute("INSERT INTO account_favorites VALUES('member-1','member-a')")
        with self.assertRaises(sqlite3.IntegrityError): self.db.execute("INSERT INTO account_favorites VALUES('member-1','member-a')")
        self.db.execute("DELETE FROM accounts WHERE id='member-1'")
        self.assertEqual(self.db.execute('SELECT count(*) FROM account_favorites').fetchone()[0],1)
    def test_token_cannot_be_used_twice(self):
        self.account()
        self.db.execute("INSERT INTO account_tokens VALUES('hash','admin-1','reset','owner@example.invalid',99999)")
        update="UPDATE accounts SET display_name='changed' WHERE id='admin-1' AND EXISTS(SELECT 1 FROM account_tokens WHERE hash='hash' AND expires_at>1)"
        self.assertEqual(self.db.execute(update).rowcount,1)
        self.db.execute("DELETE FROM account_tokens WHERE hash='hash'")
        self.assertEqual(self.db.execute(update).rowcount,0)
    def test_order_retry_cannot_create_two_orders(self):
        values=('order-1',None,'guest@example.invalid','requested','{}',1000,'guest-hash','same-key',1,1)
        self.db.execute('INSERT INTO orders VALUES(?,?,?,?,?,?,?,?,?,?)',values)
        with self.assertRaises(sqlite3.IntegrityError): self.db.execute('INSERT INTO orders VALUES(?,?,?,?,?,?,?,?,?,?)',('order-2',*values[1:]))
    def test_out_of_order_feed_does_not_replace_newer_results(self):
        sql="INSERT INTO content_records(kind,slug,data,published,updated_at,updated_by) VALUES('tournament-feed','cup',?,1,1,'software') ON CONFLICT(kind,slug) DO UPDATE SET data=excluded.data WHERE json_extract(content_records.data,'$.sourceTimestamp')<json_extract(excluded.data,'$.sourceTimestamp')"
        self.db.execute(sql,('{"sourceTimestamp":200}',))
        self.db.execute(sql,('{"sourceTimestamp":100}',))
        self.assertEqual(self.db.execute("SELECT json_extract(data,'$.sourceTimestamp') FROM content_records").fetchone()[0],200)
        self.db.execute(sql,('{"sourceTimestamp":300}',))
        self.assertEqual(self.db.execute("SELECT json_extract(data,'$.sourceTimestamp') FROM content_records").fetchone()[0],300)

if __name__ == '__main__': unittest.main()
