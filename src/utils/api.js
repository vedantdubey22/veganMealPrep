const getNutritionInfo = async (foodId) => {
  try {
    console.log('Getting nutrition info for food ID:', foodId);
    const response = await api.get(`/food/nutrition/${foodId}`);
    console.log('Nutrition response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching nutrition data:', error);
    throw error;
  }
};

export default getNutritionInfo; 