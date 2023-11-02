import { useQuery } from "@tanstack/react-query";
import axios from "axios";

function App() {
  const environment = getEnv();
  return (
    <div className="p-8">
      <h1 className="text-xl font-bold text-violet-500">
        Hello React Dash in ({environment})
      </h1>
      <Recipes />
    </div>
  );
}

function useRecipes() {
  return useQuery({
    queryKey: ["recipes"],
    queryFn: async () =>
      axios
        .get(
          getEnv() === "Standalone"
            ? "https://localhost:5375/api/recipes"
            : "/api/recipes"
        )
        .then((response) => response.data),
  });
}

export function getEnv() {
  const env = window.ASPNETCORE_ENVIRONMENT;
  return env === "{{ASPNETCORE_ENVIRONMENT}}" ? "Standalone" : env;
}

// The component that displays the recipes in a card format
function Recipes() {
  const { isLoading, data } = useRecipes();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {data &&
        data?.map(
          (recipe: {
            id: string;
            imageLink: string;
            title: string;
            description: string;
            recipeSourceLink: string;
          }) => (
            <div key={recipe.id} className="p-4 bg-white rounded-lg shadow-lg">
              <img
                src={recipe.imageLink}
                alt={recipe.title}
                className="object-cover w-full h-32 sm:h-48"
              />
              <div className="p-4">
                <h2 className="text-lg font-bold">{recipe.title}</h2>
                <p className="text-sm">{recipe.description}</p>
                <a
                  href={recipe.recipeSourceLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Source
                </a>
              </div>
            </div>
          )
        )}
    </div>
  );
}

export default App;
