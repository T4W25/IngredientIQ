// import React, { useState, useEffect } from "react";
// import { getRecipes } from "../../api/api";
// import { useLocation } from "react-router-dom";
// import RecipeCard from "../../components/recipe/RecipeCard";

// const SearchResults = () => {
//   const [recipes, setRecipes] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const query = queryParams.get("q") || "";

//   useEffect(() => {
//     const fetchRecipes = async () => {
//       setLoading(true);
//       try {
//         const filters = { query };
//         const response = await getRecipes(filters);
//         setRecipes(response.data);
//       } catch (error) {
//         console.error("Error fetching recipes:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRecipes();
//   }, [query]);

//   return (
//     <div style={{ padding: "2rem" }}>
//       <h2>🔍 Search Results for "{query}"</h2>

//       {loading ? (
//         <p>Loading...</p>
//       ) : recipes.length === 0 ? (
//         <p>No recipes found. Try a different keyword!</p>
//       ) : (
//         <div className="recipe-grid">
//           {recipes.map((recipe) => (
//             <RecipeCard key={recipe._id} recipe={recipe} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default SearchResults;


import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Button from '../Components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { useToast } from '../components/ui/use-toast';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    difficulty: 'all',
    prepTime: 'all',
    calories: 'all',
  });
  const [sortBy, setSortBy] = useState('relevance');
  const { toast } = useToast();

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const query = searchParams.get('q') || '';
        // TODO: Implement API call to fetch search results
        // const response = await fetch(`/api/recipes/search?q=${query}`);
        // const data = await response.json();
        // setRecipes(data);

        // Temporary mock data
        setRecipes([
          {
            id: 1,
            title: 'Healthy Mediterranean Pasta',
            description: 'A delicious and nutritious pasta dish with fresh vegetables and olive oil.',
            prepTime: '15 minutes',
            difficulty: 'Easy',
            calories: 350,
            image: 'https://example.com/pasta.jpg',
            chef: {
              name: 'Chef John',
              avatar: 'https://example.com/avatar.jpg'
            }
          },
          {
            id: 2,
            title: 'Quinoa Buddha Bowl',
            description: 'A protein-rich bowl packed with vegetables and healthy grains.',
            prepTime: '20 minutes',
            difficulty: 'Medium',
            calories: 450,
            image: 'https://example.com/bowl.jpg',
            chef: {
              name: 'Chef Sarah',
              avatar: 'https://example.com/avatar2.jpg'
            }
          },
          // Add more mock recipes as needed
        ]);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch search results",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchParams, toast]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const filteredRecipes = recipes.filter(recipe => {
    if (filters.difficulty !== 'all' && recipe.difficulty !== filters.difficulty) return false;
    if (filters.prepTime !== 'all' && recipe.prepTime !== filters.prepTime) return false;
    if (filters.calories !== 'all') {
      const calories = parseInt(recipe.calories);
      if (filters.calories === 'low' && calories > 300) return false;
      if (filters.calories === 'medium' && (calories <= 300 || calories > 500)) return false;
      if (filters.calories === 'high' && calories <= 500) return false;
    }
    return true;
  });

  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    switch (sortBy) {
      case 'prepTime':
        return a.prepTime.localeCompare(b.prepTime);
      case 'calories':
        return a.calories - b.calories;
      case 'difficulty':
        return a.difficulty.localeCompare(b.difficulty);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">
          Search Results for "{searchParams.get('q') || 'all recipes'}"
        </h1>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <select
            value={filters.difficulty}
            onChange={(e) => handleFilterChange('difficulty', e.target.value)}
            className="border rounded-md px-3 py-2"
          >
            <option value="all">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <select
            value={filters.prepTime}
            onChange={(e) => handleFilterChange('prepTime', e.target.value)}
            className="border rounded-md px-3 py-2"
          >
            <option value="all">All Prep Times</option>
            <option value="15 minutes">Quick (15 mins)</option>
            <option value="20 minutes">Medium (20 mins)</option>
            <option value="30 minutes">Long (30+ mins)</option>
          </select>

          <select
            value={filters.calories}
            onChange={(e) => handleFilterChange('calories', e.target.value)}
            className="border rounded-md px-3 py-2"
          >
            <option value="all">All Calories</option>
            <option value="low">Low (≤300)</option>
            <option value="medium">Medium (301-500)</option>
            <option value="high">High (&gt;500)</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded-md px-3 py-2"
          >
            <option value="relevance">Relevance</option>
            <option value="prepTime">Prep Time</option>
            <option value="calories">Calories</option>
            <option value="difficulty">Difficulty</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedRecipes.map((recipe) => (
          <Card key={recipe.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <CardTitle className="mt-4">{recipe.title}</CardTitle>
              <CardDescription>{recipe.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <img
                    src={recipe.chef.avatar}
                    alt={recipe.chef.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-sm">{recipe.chef.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">{recipe.prepTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{recipe.difficulty}</span>
                <span className="text-sm text-muted-foreground">{recipe.calories} calories</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sortedRecipes.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">No recipes found</h2>
          <p className="text-muted-foreground mb-4">
            Try adjusting your filters or search terms
          </p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      )}
    </div>
  );
};

export default SearchResults; 