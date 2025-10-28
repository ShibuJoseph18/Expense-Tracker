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
    initial_deposit BOOLEAN 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS cash_balances (
    user_id INTEGER PRIMARY KEY,
    initial_deposit BOOLEAN 0,
    balance REAL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('expense', 'income')) NOT NULL,
    is_global BOOLEAN DEFAULT 1,      -- 1 = system category, 0 = user-defined
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_categories (
    user_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    is_hidden BOOLEAN DEFAULT 0,          -- user can hide any category (global or custom)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, category_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS subcategories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    is_global BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS user_subcategories (
    user_id INTEGER NOT NULL,
    subcategory_id INTEGER NOT NULL,
    is_hidden BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, subcategory_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (subcategory_id) REFERENCES subcategories(id)
);

CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    type TEXT CHECK (type IN ('expense', 'income')) NOT NULL, 
    amount REAL NOT NULL,
    is_cash BOOLEAN DEFAULT 0,
    account_id INTEGER,
    category_id INTEGER NOT NULL,   
    subcategory_id INTEGER,
    note TEXT,
    date DATETIME DEFAULT CURRENT_TIMESTAMP, 
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(account_id) REFERENCES accounts(id),
    FOREIGN KEY(category_id) REFERENCES category(id),
    FOREIGN KEY(subcategory_id) REFERENCES subcategory(id),
    CHECK (
        (is_cash = 1 AND account_id IS NULL) OR
        (is_cash = 0 AND account_id IS NOT NULL)
    )
);
