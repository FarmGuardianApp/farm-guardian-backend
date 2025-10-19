-- This script runs automatically inside the 'farmguardian_db_v2' database
-- after the 'newuser' has been created.

-- Create the 'farms' table to store information about each farm.
CREATE TABLE farms (
    id SERIAL PRIMARY KEY, -- Automatically incrementing integer ID
    name VARCHAR(100) NOT NULL, -- The name of the farm
    location VARCHAR(255), -- The geographical location of the farm
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP -- Automatically set the creation date
);

-- Grant permissions for our user to use the new table.
GRANT ALL ON TABLE farms TO newuser;

