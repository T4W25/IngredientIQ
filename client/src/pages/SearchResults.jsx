
  import React, { useState, useEffect } from 'react';
  import { useSearchParams } from 'react-router-dom';
  import { searchRecipes } from '../api/api';
  import Button from '../components/ui/button';
  import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent
  } from '../components/ui/card';
  import { useToast } from '../components/ui/use-toast';
  import Navbar from '../Components/ui/navbar';

  const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
      difficulty: 'all',
      prepTime: 'all',
      cookTime: 'all',
      calories: 'all',
    });
    const [sortBy, setSortBy] = useState('relevance');
    const { toast } = useToast();

    useEffect(() => {
      const fetchSearchResults = async () => {
        try {
          setLoading(true);
          
          // Construct API parameters
          const apiParams = {
            query: searchParams.get('q'),
            dietary: searchParams.get('dietary'),
          };
  
          // Add filter parameters if they're not set to 'all'
          if (filters.difficulty !== 'all') {
            apiParams.difficulty = filters.difficulty.toLowerCase();
          }
          if (filters.prepTime !== 'all') {
            apiParams.prepTime = parseInt(filters.prepTime);
          }
          if (filters.cookTime !== 'all') {
            apiParams.cookTime = parseInt(filters.cookTime);
          }
  
          const data = await searchRecipes(apiParams);
          setRecipes(data);
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
    }, [searchParams, filters, toast]);


    const getFilteredAndSortedRecipes = () => {
      let filteredRecipes = [...recipes];
  
      // Apply calorie filter (frontend filtering since it's not in backend)
      if (filters.calories !== 'all') {
        filteredRecipes = filteredRecipes.filter(recipe => {
          const calories = recipe.nutritionalInfo?.calories || 0;
          switch (filters.calories) {
            case 'low':
              return calories <= 300;
            case 'medium':
              return calories > 300 && calories <= 500;
            case 'high':
              return calories > 500;
            default:
              return true;
          }
        });
      }
  
      // Apply sorting
      return filteredRecipes.sort((a, b) => {
        switch (sortBy) {
          case 'prepTime':
            return (a.prepTime || 0) - (b.prepTime || 0);
          case 'calories':
            return (a.nutritionalInfo?.calories || 0) - (b.nutritionalInfo?.calories || 0);
          case 'difficulty':
            const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
            return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
          case 'rating':
            return (b.averageRating || 0) - (a.averageRating || 0);
          default:
            return 0;
        }
      });
    };
  
    const handleFilterChange = (filterType, value) => {
      setFilters(prev => ({
        ...prev,
        [filterType]: value
      }));
    };
  
    const filteredAndSortedRecipes = getFilteredAndSortedRecipes();
    // const handleFilterChange = (filterType, value) => {
    //   setFilters(prev => ({
    //     ...prev,
    //     [filterType]: value
    //   }));
    // };

    // // 🌐 Pull query and filter from searchParams
    // const query = (searchParams.get('q') || '').toLowerCase();
    // const urlFilters = searchParams.getAll("filter");

    // // 🔍 Apply all filters including query
    // const filteredRecipes = recipes.filter(recipe => {
    //   if (query && !recipe.title.toLowerCase().includes(query)) return false;
    //   if (filters.difficulty !== 'all' && recipe.difficulty !== filters.difficulty) return false;
    //   if (filters.prepTime !== 'all' && recipe.prepTime !== filters.prepTime) return false;
    //   if (filters.calories !== 'all') {
    //     const calories = parseInt(recipe.calories);
    //     if (filters.calories === 'low' && calories > 300) return false;
    //     if (filters.calories === 'medium' && (calories <= 300 || calories > 500)) return false;
    //     if (filters.calories === 'high' && calories <= 500) return false;
    //   }
    //   if (urlFilters.length > 0) {
    //     for (let filter of urlFilters) {
    //       if (!recipe.dietaryRestrictions?.[filter]) return false;
    //     }
    //   }
    //   return true;
    // });

    // const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    //   switch (sortBy) {
    //     case 'prepTime':
    //       return a.prepTime.localeCompare(b.prepTime);
    //     case 'calories':
    //       return a.calories - b.calories;
    //     case 'difficulty':
    //       return a.difficulty.localeCompare(b.difficulty);
    //     default:
    //       return 0;
    //   }
    // });


    const renderRecipeCard = (recipe) => (
      <Card key={recipe._id} className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <img
            src={recipe.mainImage || 'https://via.placeholder.com/400x300'}
            alt={recipe.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <CardTitle className="mt-4">{recipe.title}</CardTitle>
          <CardDescription>{recipe.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm">{recipe.authorId?.username || 'Anonymous'}</span>
            </div>
            <span className="text-sm text-muted-foreground">{recipe.prepTime} mins</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{recipe.difficulty}</span>
            <span className="text-sm text-muted-foreground">
              {recipe.nutritionalInfo?.calories || 0} calories
            </span>
          </div>
        </CardContent>
      </Card>
    );

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      );
    }

    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">
              Search Results for "{searchParams.get('q') || 'all recipes'}"
            </h1>
  
            {/* Filter Controls */}
            <div className="flex flex-wrap gap-4 mb-6">
              <select
                value={filters.difficulty}
                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                className="border rounded-md px-3 py-2"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
  
              <select
                value={filters.prepTime}
                onChange={(e) => handleFilterChange('prepTime', e.target.value)}
                className="border rounded-md px-3 py-2"
              >
                <option value="all">All Prep Times</option>
                <option value="15">15 minutes or less</option>
                <option value="30">30 minutes or less</option>
                <option value="45">45 minutes or less</option>
                <option value="60">60 minutes or less</option>
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
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>
  
          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              {/* Results Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedRecipes.map((recipe) => (
                  <Card key={recipe._id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <img
                        src={recipe.mainImage || 'https://via.placeholder.com/400x300'}
                        alt={recipe.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      <CardTitle className="mt-4">{recipe.title}</CardTitle>
                      <CardDescription>{recipe.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">{recipe.authorId?.username || 'Anonymous'}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          Prep: {recipe.prepTime}m | Cook: {recipe.cookTime}m
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium capitalize">{recipe.difficulty}</span>
                        <span className="text-sm text-muted-foreground">
                          {recipe.nutritionalInfo?.calories || 0} calories
                        </span>
                      </div>
                      {recipe.averageRating > 0 && (
                        <div className="mt-2 text-sm text-yellow-500">
                          Rating: {recipe.averageRating.toFixed(1)} ⭐
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
  
              {/* No Results State */}
              {filteredAndSortedRecipes.length === 0 && (
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold mb-4">No recipes found</h2>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters or search terms
                  </p>
                  <Button onClick={() => window.history.back()}>Go Back</Button>
                </div>
              )}
            </>
          )}
        </div>
      </>
    );
  };
  
  export default SearchResults;