-- categories
INSERT INTO categories (name, type) 
VALUES 
    ('Salary', 'income'), 
    ('Gifts', 'income'),
    ('Food and Drinks', 'expense'),
    ('Shopping', 'expense'),
    ('Housing', 'expense'),
    ('Bills', 'expense'),
    ('Transport', 'expense'),
    ('Vehicle', 'expense'),
    ('Leisure', 'expense'),
    ('Other', 'expense');

-- Food and Drinks
INSERT OR IGNORE INTO subcategories (category_id, name)
SELECT id, 'Groceries' FROM categories WHERE name = 'Food and Drinks';
INSERT OR IGNORE INTO subcategories (category_id, name)
SELECT id, 'Restaurants' FROM categories WHERE name = 'Food and Drinks';
INSERT OR IGNORE INTO subcategories (category_id, name)
SELECT id, 'Delivery' FROM categories WHERE name = 'Food and Drinks';

-- Shopping
INSERT OR IGNORE INTO subcategories (category_id, name)
SELECT id, 'Clothing' FROM categories WHERE name = 'Shopping';
INSERT OR IGNORE INTO subcategories (category_id, name)
SELECT id, 'Electronics' FROM categories WHERE name = 'Shopping';
INSERT OR IGNORE INTO subcategories (category_id, name)
SELECT id, 'Kids' FROM categories WHERE name = 'Shopping';
INSERT OR IGNORE INTO subcategories (category_id, name)
SELECT id, 'Pets' FROM categories WHERE name = 'Shopping';
INSERT OR IGNORE INTO subcategories (category_id, name)
SELECT id, 'Gifts' FROM categories WHERE name = 'Shopping';

-- Housing
INSERT OR IGNORE INTO subcategories (category_id, name)
SELECT id, 'Utilities' FROM categories WHERE name = 'Housing';
INSERT OR IGNORE INTO subcategories (category_id, name)
SELECT id, 'Mortgage' FROM categories WHERE name = 'Housing';
INSERT OR IGNORE INTO subcategories (category_id, name)
SELECT id, 'Rent' FROM categories WHERE name = 'Housing';
INSERT OR IGNORE INTO subcategories (category_id, name)
SELECT id, 'Maintenance' FROM categories WHERE name = 'Housing';

-- Bills
INSERT OR IGNORE INTO subcategories (category_id, name)
SELECT id, 'Phone' FROM categories WHERE name = 'Bills';
INSERT OR IGNORE INTO subcategories (category_id, name)
SELECT id, 'Internet' FROM categories WHERE name = 'Bills';
INSERT OR IGNORE INTO subcategories (category_id, name)
SELECT id, 'Subscriptions' FROM categories WHERE name = 'Bills';
INSERT OR IGNORE INTO subcategories (category_id, name)
SELECT id, 'Healthcare' FROM categories WHERE name = 'Bills';
INSERT OR IGNORE INTO subcategories (category_id, name)
SELECT id, 'Taxes' FROM categories WHERE name = 'Bills';

-- Transport
INSERT OR IGNORE INTO subcategories (category_id, name)
SELECT id, 'Public' FROM categories WHERE name = 'Transport';
INSERT OR IGNORE INTO subcategories (category_id, name)
SELECT id, 'Taxi' FROM categories WHERE name = 'Transport';
INSERT OR IGNORE INTO subcategories (category_id, name)
SELECT id, 'Long Distance' FROM categories WHERE name = 'Transport';

-- Vehicle
INSERT OR IGNORE INTO subcategories (category_id, name)
SELECT id, 'Fuel' FROM categories WHERE name = 'Vehicle';
INSERT OR IGNORE INTO subcategories (category_id, name)
SELECT id, 'Parking' FROM categories WHERE name = 'Vehicle';
INSERT OR IGNORE INTO subcategories (category_id, name)
SELECT id, 'Maintenance' FROM categories WHERE name = 'Vehicle';
INSERT OR IGNORE INTO subcategories (category_id, name)
SELECT id, 'Insurance' FROM categories WHERE name = 'Vehicle';

-- Leisure
INSERT OR IGNORE INTO subcategories (category_id, name)
SELECT id, 'Entertainment' FROM categories WHERE name = 'Leisure';
INSERT OR IGNORE INTO subcategories (category_id, name)
SELECT id, 'Hobbies' FROM categories WHERE name = 'Leisure';
INSERT OR IGNORE INTO subcategories (category_id, name)
SELECT id, 'Sports' FROM categories WHERE name = 'Leisure';
INSERT OR IGNORE INTO subcategories (category_id, name)
SELECT id, 'Vacations' FROM categories WHERE name = 'Leisure';
