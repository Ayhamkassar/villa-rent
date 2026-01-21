/**
 * Type Definitions
 * JSDoc type definitions for the application
 */

/**
 * @typedef {Object} User
 * @property {string} _id - User ID
 * @property {string} name - User name
 * @property {string} email - User email
 * @property {boolean} isAdmin - Is admin user
 * @property {string} [profileImage] - Profile image path
 * @property {Date} createdAt - Creation date
 * @property {Date} updatedAt - Last update date
 */

/**
 * @typedef {Object} Farm
 * @property {string} _id - Farm ID
 * @property {string} name - Farm name
 * @property {string} description - Farm description
 * @property {string|Object} address - Farm address
 * @property {string} type - Farm type (sale/rent)
 * @property {string} status - Farm status
 * @property {number} [price] - Sale price
 * @property {number} [midweekPrice] - Midweek rental price
 * @property {number} [weekendPrice] - Weekend rental price
 * @property {number} [guests] - Number of guests
 * @property {number} [bedrooms] - Number of bedrooms
 * @property {number} [bathrooms] - Number of bathrooms
 * @property {number} [sizeInHectares] - Size in hectares
 * @property {string[]} images - Array of image IDs
 * @property {string|User} ownerId - Owner user ID or object
 * @property {string} [contactNumber] - Contact phone number
 * @property {string} [startBookingTime] - Booking start time
 * @property {string} [endBookingTime] - Booking end time
 * @property {Date} createdAt - Creation date
 * @property {Date} updatedAt - Last update date
 */

/**
 * @typedef {Object} Booking
 * @property {string} _id - Booking ID
 * @property {string|Farm} farmId - Farm ID or object
 * @property {string|User} userId - User ID or object
 * @property {string} userName - User name
 * @property {string} from - Start date
 * @property {string} to - End date
 * @property {number} totalPrice - Total booking price
 * @property {BookingStatus} status - Booking status
 * @property {Date} createdAt - Creation date
 * @property {Date} updatedAt - Last update date
 */

/**
 * @typedef {'pending' | 'confirmed' | 'cancelled'} BookingStatus
 */

/**
 * @typedef {'sale' | 'rent'} FarmType
 */

/**
 * @typedef {'all' | 'sale' | 'rent'} FarmFilter
 */

/**
 * @typedef {Object} AuthState
 * @property {boolean} isAuthenticated - Is user authenticated
 * @property {boolean} isAdmin - Is admin user
 * @property {string|null} userId - User ID
 * @property {string|null} token - Auth token
 */

/**
 * @typedef {Object} LoginResponse
 * @property {string} token - Auth token
 * @property {User} user - User data
 */

/**
 * @typedef {Object} FarmFormData
 * @property {string} title - Farm name
 * @property {string} description - Farm description
 * @property {string} address - Farm address
 * @property {FarmType} type - Farm type
 * @property {string} status - Farm status
 * @property {string} [price] - Sale price
 * @property {string} [midweekPrice] - Midweek price
 * @property {string} [weekendPrice] - Weekend price
 * @property {string} [guests] - Number of guests
 * @property {string} [bedrooms] - Number of bedrooms
 * @property {string} [bathrooms] - Number of bathrooms
 * @property {string} [sizeInHectares] - Size in hectares
 * @property {Object[]} images - Selected images
 * @property {string} ownerId - Owner user ID
 * @property {string} [contactNumber] - Contact number
 * @property {string} [startBookingTime] - Booking start time
 * @property {string} [endBookingTime] - Booking end time
 */

/**
 * @typedef {Object} BookingFormData
 * @property {string} farmId - Farm ID
 * @property {string} userId - User ID
 * @property {string} userName - User name
 * @property {string} fromDate - Start date
 * @property {string} toDate - End date
 * @property {number} totalPrice - Total price
 */

// Export empty object for module compatibility
export default {};
