import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core'

export const accounts = sqliteTable('accounts', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  displayName: text('display_name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').notNull().default('member'),
  platformId: text('platform_id').unique(),
  createdAt: integer('created_at').notNull(),
})
export const sessions = sqliteTable('account_sessions', {
  tokenHash: text('token_hash').primaryKey(),
  accountId: text('account_id').notNull().references(() => accounts.id, { onDelete: 'cascade' }),
  expiresAt: integer('expires_at').notNull(),
})
export const contentRecords = sqliteTable('content_records', {
  kind: text('kind').notNull(),
  slug: text('slug').notNull(),
  data: text('data').notNull(),
  published: integer('published', { mode: 'boolean' }).notNull().default(false),
  updatedAt: integer('updated_at').notNull(),
  updatedBy: text('updated_by').notNull(),
}, table => [primaryKey({ columns: [table.kind, table.slug] })])
export const auditLog = sqliteTable('admin_audit', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  action: text('action').notNull(),
  target: text('target').notNull(),
  createdAt: integer('created_at').notNull(),
})
export const loginAttempts = sqliteTable('login_attempts', {
  key: text('key').primaryKey(),
  count: integer('count').notNull().default(0),
  windowEnd: integer('window_end').notNull(),
})
export const siteSettings = sqliteTable('site_settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
})

export const profiles = sqliteTable('account_profiles', {
 accountId:text('account_id').primaryKey().references(()=>accounts.id,{onDelete:'cascade'}),
 data:text('data').notNull(), emailVerified:integer('email_verified').notNull().default(0),
})
export const favorites = sqliteTable('account_favorites', {
 accountId:text('account_id').notNull().references(()=>accounts.id,{onDelete:'cascade'}),memberSlug:text('member_slug').notNull(),
},t=>[primaryKey({columns:[t.accountId,t.memberSlug]})])
export const accountTokens=sqliteTable('account_tokens',{
 hash:text('hash').primaryKey(),accountId:text('account_id').notNull().references(()=>accounts.id,{onDelete:'cascade'}),purpose:text('purpose').notNull(),payload:text('payload').notNull().default(''),expiresAt:integer('expires_at').notNull(),
})
export const contacts=sqliteTable('contacts',{
 id:text('id').primaryKey(),accountId:text('account_id'),name:text('name').notNull(),email:text('email').notNull(),type:text('type').notNull(),subject:text('subject').notNull(),message:text('message').notNull(),orderNumber:text('order_number').notNull().default(''),status:text('status').notNull().default('new'),assignee:text('assignee').notNull().default(''),note:text('note').notNull().default(''),createdAt:integer('created_at').notNull(),updatedAt:integer('updated_at').notNull(),
})
export const contactReplies=sqliteTable('contact_replies',{
 id:text('id').primaryKey(),contactId:text('contact_id').notNull().references(()=>contacts.id,{onDelete:'cascade'}),authorId:text('author_id').notNull(),body:text('body').notNull(),state:text('state').notNull(),error:text('error').notNull().default(''),createdAt:integer('created_at').notNull(),
})
export const orders=sqliteTable('orders',{
 id:text('id').primaryKey(),accountId:text('account_id'),email:text('email').notNull(),status:text('status').notNull().default('requested'),data:text('data').notNull(),total:integer('total').notNull(),guestHash:text('guest_hash').notNull(),idempotency:text('idempotency').notNull().unique(),createdAt:integer('created_at').notNull(),updatedAt:integer('updated_at').notNull(),
})
