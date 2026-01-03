const API_BASE_URL = "http://localhost:8000"; //dev
// const API_BASE_URL = "https://serverproject-4m9x.onrender.com";//prod

export async function fetchRestaurants(page = 1, limit = 3) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/restaurants?page=${page}&limit=${limit}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("got data:", data);
    if (data && data.restaurants) {
      // Process restaurant data to set picture URL using the picture endpoint
      const processedData = data.restaurants.map((restaurant) => {
        // Construct the picture URL using the server's picture endpoint
        restaurant.picture = `${API_BASE_URL}/api/restaurants/${restaurant._id}/picture`;
        return restaurant;
      });

      return {
        restaurants: processedData,
        pagination: data.pagination,
        // totalPages: data.totalPages,
        // currentPage: data.currentPage,
        // totalRestaurants: data.totalRestaurants,
      };
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

/**
 * Updates a restaurant by ID
 * @param {string} restaurantId - The MongoDB ObjectId of the restaurant
 * @param {Object} updatedData - The fields to update (must include ownerId for authorization)
 * @returns {Promise<Object>} The response data with update result
 */
export async function updateRestaurant(restaurantId, updatedData) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/restaurants/${restaurantId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Update result:", data);
    return data;
  } catch (error) {
    console.error("Error updating restaurant:", error);
    throw error;
  }
}

/**
 * Creates a new restaurant
 * @param {Object} restaurantData - The restaurant data to create (including ownerId)
 * @returns {Promise<Object>} The created restaurant data
 */
export async function createRestaurant(restaurantData) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/restaurants`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(restaurantData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Create result:", data);
    return data;
  } catch (error) {
    console.error("Error creating restaurant:", error);
    throw error;
  }
}

/**
 * Deletes a restaurant by ID
 * @param {string} restaurantId - The MongoDB ObjectId of the restaurant to delete
 * @param {string} ownerId - The Firebase UID of the restaurant owner (required for authorization)
 * @returns {Promise<Object>} The response data with deletion result
 */
export async function deleteRestaurant(restaurantId, ownerId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/restaurants/${restaurantId}?ownerId=${encodeURIComponent(ownerId)}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Delete result:", data);
    return data;
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    throw error;
  }
}

/**
 * Retrieves a restaurant by owner UID
 * @param {string} ownerId - The Firebase UID of the restaurant owner
 * @returns {Promise<Object|null>} The restaurant data or null if not found
 */
export async function getRestaurantByOwnerId(ownerId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/restaurants/owner/${ownerId}`);

    if (!response.ok) {
      if (response.status === 404) {
        // Owner has no restaurant yet
        return null;
      }
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Restaurant by owner:", data);

    // Process picture URL
    if (data.restaurant) {
      data.restaurant.picture = `${API_BASE_URL}/api/restaurants/${data.restaurant._id}/picture`;
    }

    return data.restaurant;
  } catch (error) {
    console.error("Error fetching restaurant by owner:", error);
    throw error;
  }
}

export async function uploadRestaurantPicture(restaurantId, imageFile) {
  try {
    const formData = new FormData();
    formData.append("picture", imageFile);

    const response = await fetch(`http://localhost:8000/api/restaurants/${restaurantId}/picture`, {
      method: "POST",
      body: formData, // Don't set Content-Type header - browser sets it automatically with boundary
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Upload result:", data);
    return data;
  } catch (error) {
    console.error("Error uploading picture:", error);
    throw error;
  }
}

/**
 * Searches restaurants by a specific field
 * @param {string} field - The field to search by (name, cuisine, borough, etc.)
 * @param {string} query - The search query
 * @param {number} page - Page number for pagination
 * @param {number} limit - Number of results per page
 * @returns {Promise<Object>} Search results with pagination data
 */
export async function searchRestaurants(field, query, page = 1, limit = 3) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/restaurants/search?field=${encodeURIComponent(
        field,
      )}&query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Search result:", data);

    if (data && data.restaurants) {
      // Process restaurant data to set picture URL using the picture endpoint
      const processedData = data.restaurants.map((restaurant) => {
        restaurant.picture = `${API_BASE_URL}/api/restaurants/${restaurant._id}/picture`;
        return restaurant;
      });

      return {
        restaurants: processedData,
        pagination: data.pagination,
      };
    } else {
      return { restaurants: [], pagination: { totalPages: 0 } };
    }
  } catch (error) {
    console.error("Error searching restaurants:", error);
    throw error;
  }
}

/**
 * Creates a new user in MongoDB
 * @param {Object} userData - The user data to create
 * @param {string} userData.uid - Firebase user ID
 * @param {string} userData.email - User email
 * @param {string} userData.name - User name
 * @param {string} userData.role - User role ("user" or "manager")
 * @returns {Promise<Object>} The created user data
 */
export async function createUser(userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("User created:", data);
    return data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

/**
 * Retrieves a user by Firebase UID
 * @param {string} uid - The Firebase UID of the user
 * @returns {Promise<Object>} The user data
 */
export async function getUserByUid(uid) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/uid/${uid}`);
    console.log("response:", response);
    if (!response.ok) {
      const errorData = await response.json();
      console.log("errorData:", errorData);
      // throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}

/**
 * Updates the email verification status for a user
 * @param {string} uid - The Firebase UID of the user
 * @param {boolean} isEmailVerified - The email verification status
 * @returns {Promise<Object>} The response data
 */
export async function updateUserEmailVerification(uid, isEmailVerified) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/uid/${uid}/verify-email`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isEmailVerified }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Email verification updated:", data);
    return data;
  } catch (error) {
    console.error("Error updating email verification:", error);
    throw error;
  }
}
