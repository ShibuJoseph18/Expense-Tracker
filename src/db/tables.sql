CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    mobile TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,        -- e.g. "HDFC Bank", "SBI Account"
    bank_name TEXT,
    account_number TEXT,
    balance REAL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS cash_balances (
    user_id INTEGER PRIMARY KEY,
    balance REAL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('expense', 'income')) NOT NULL,
    is_global BOOLEAN DEFAULT 1,          -- 1 = system category, 0 = user-defined
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS user_categories (
    user_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    is_hidden BOOLEAN DEFAULT 0,          -- user can hide any category (global or custom)
    PRIMARY KEY (user_id, category_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS subcategories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    is_global BOOLEAN DEFAULT 1,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS user_subcategories (
    user_id INTEGER NOT NULL,
    subcategory_id INTEGER NOT NULL,
    is_hidden BOOLEAN DEFAULT 0,
    PRIMARY KEY (user_id, subcategory_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (subcategory_id) REFERENCES subcategories(id)
);

-- ALTER Categories
ALTER TABLE categories 
ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE categories 
ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP;

-- ALTER SubCategories
ALTER TABLE subcategories 
ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE subcategories 
ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP;

-- ALTER User Categories
ALTER TABLE user_categories 
ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE user_categories 
ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP;

-- ALTER transacations
ALTER TABLE transactions 
ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE transactions 
ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP;
