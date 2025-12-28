export async function fetchRestaurants() {
  try {
    // Make sure the URL matches your Node.js server's address and port
    const response = await fetch("http://localhost:8000/api/restaurants");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("got data:", data);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

/**
 * Updates a restaurant by ID
 * @param {string} restaurantId - The MongoDB ObjectId of the restaurant
 * @param {Object} updatedData - The fields to update (e.g., { name: "New Name", cuisine: "Italian" })
 * @returns {Promise<Object>} The response data with update result
 */
export async function updateRestaurant(restaurantId, updatedData) {
  try {
    const response = await fetch(`http://localhost:8000/api/restaurants/${restaurantId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
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
 * @param {Object} restaurantData - The restaurant data to create
 * @returns {Promise<Object>} The created restaurant data
 */
export async function createRestaurant(restaurantData) {
  try {
    const response = await fetch("http://localhost:8000/api/restaurants", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(restaurantData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
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
 * @returns {Promise<Object>} The response data with deletion result
 */
export async function deleteRestaurant(restaurantId) {
  try {
    const response = await fetch(`http://localhost:8000/api/restaurants/${restaurantId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Delete result:", data);
    return data;
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    throw error;
  }
}
