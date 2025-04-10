
  import React, { useState, useEffect } from 'react';
  import { useSearchParams } from 'react-router-dom';
  import Button from '../components/ui/button';
  import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent
  } from '../components/ui/card';
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
          // Mock data (with 2 added dishes)
          setRecipes([
            {
              id: 1,
              title: 'Healthy Mediterranean Pasta',
              description: 'A delicious and nutritious pasta dish with fresh vegetables and olive oil.',
              prepTime: '15 minutes',
              difficulty: 'Easy',
              calories: 350,
              image: 'https://source.unsplash.com/400x300/?pasta',
              chef: { name: 'Chef John', avatar: 'https://i.pravatar.cc/150?img=1' },
              dietaryRestrictions: { isVegetarian: true, isVegan: true, isGlutenFree: true }
            },
            {
              id: 2,
              title: 'Grilled Chicken Salad',
              description: 'Lean grilled chicken served on a fresh bed of greens.',
              prepTime: '15 minutes',
              difficulty: 'Easy',
              calories: 300,
              image: 'https://source.unsplash.com/400x300/?salad',
              chef: { name: 'Chef Lisa', avatar: 'https://i.pravatar.cc/150?img=4' },
              dietaryRestrictions: { isVegetarian: false, isVegan: false, isGlutenFree: true }
            },
            {
              id: 3,
              title: 'Keto Avocado Wrap',
              description: 'A low-carb wrap with creamy avocado and crispy bacon.',
              prepTime: '10 minutes',
              difficulty: 'Medium',
              calories: 250,
              image: 'https://source.unsplash.com/400x300/?avocado',
              chef: { name: 'Chef Rob', avatar: 'https://i.pravatar.cc/150?img=5' },
              dietaryRestrictions: { isVegetarian: true, isVegan: false, isGlutenFree: true }
            },
            {
              id: 4,
              title: 'Kids Mac & Cheese',
              description: 'A creamy mac & cheese recipe made kid-friendly and fun.',
              prepTime: '20 minutes',
              difficulty: 'Easy',
              calories: 400,
              image: 'https://source.unsplash.com/400x300/?mac-n-cheese',
              chef: { name: 'Chef Becky', avatar: 'https://i.pravatar.cc/150?img=6' },
              dietaryRestrictions: { isVegetarian: true, isVegan: false, isGlutenFree: false }
            },
            {
              id: 5,
              title: 'Spicy Vegan Tacos',
              description: 'Tacos with spicy black beans and fresh veggies, perfect for vegans.',
              prepTime: '20 minutes',
              difficulty: 'Medium',
              calories: 320,
              image: 'https://source.unsplash.com/400x300/?tacos',
              chef: { name: 'Chef Miguel', avatar: 'https://i.pravatar.cc/150?img=7' },
              dietaryRestrictions: { isVegetarian: true, isVegan: true, isGlutenFree: false }
            },
            {
              id: 6,
              title: 'Classic Beef Stroganoff',
              description: 'Tender beef strips in a creamy mushroom sauce over noodles.',
              prepTime: '30 minutes',
              difficulty: 'Hard',
              calories: 600,
              image: 'https://source.unsplash.com/400x300/?beef',
              chef: { name: 'Chef Elena', avatar: 'https://i.pravatar.cc/150?img=8' },
              dietaryRestrictions: { isVegetarian: false, isVegan: false, isGlutenFree: false }
            }
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

    // 🌐 Pull query and filter from searchParams
    const query = (searchParams.get('q') || '').toLowerCase();
    const urlFilters = searchParams.getAll("filter");

    // 🔍 Apply all filters including query
    const filteredRecipes = recipes.filter(recipe => {
      if (query && !recipe.title.toLowerCase().includes(query)) return false;
      if (filters.difficulty !== 'all' && recipe.difficulty !== filters.difficulty) return false;
      if (filters.prepTime !== 'all' && recipe.prepTime !== filters.prepTime) return false;
      if (filters.calories !== 'all') {
        const calories = parseInt(recipe.calories);
        if (filters.calories === 'low' && calories > 300) return false;
        if (filters.calories === 'medium' && (calories <= 300 || calories > 500)) return false;
        if (filters.calories === 'high' && calories <= 500) return false;
      }
      if (urlFilters.length > 0) {
        for (let filter of urlFilters) {
          if (!recipe.dietaryRestrictions?.[filter]) return false;
        }
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
      <>
      <Navbar/>
      <div className="container mx-auto px-4 py-20">
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
              <option value="10 minutes">10 minutes</option>
              <option value="15 minutes">15 minutes</option>
              <option value="20 minutes">20 minutes</option>
              <option value="30 minutes">30 minutes</option>
            </select>

            <select
              value={filters.calories}
              onChange={(e) => handleFilterChange('calories', e.target.value)}
              className="border rounded-md px-3 py-2"
            >
              <option value="all">All Calories</option>
              <option value="low">Low (≤300)</option>
              <option value="medium">Medium (301–500)</option>
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
      </>
    );
  };

  export default SearchResults;
