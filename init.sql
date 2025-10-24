-- Create the 'farms' table to store information about each farm.
CREATE TABLE farms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- --- NEW --- Create the 'users' table for authentication
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL UNIQUE, -- Phone numbers must be unique
    otp VARCHAR(100), -- To store the hashed OTP
    otp_expires_at TIMESTAMP WITH TIME ZONE, -- To check if OTP is expired
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- Grant permissions for our user to use the new tables.
-- Note: In a real production app, you might have more granular permissions.
GRANT ALL ON TABLE farms TO newuser;
GRANT ALL ON TABLE users TO newuser;