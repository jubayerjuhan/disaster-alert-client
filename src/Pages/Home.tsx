import React, { useEffect, useState } from "react";
import { Cloud, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import moment from "moment";
import DisasterTable from "@/components/DisasterTable/DisasterTable";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar/Navbar";

interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface Wind {
  speed: number;
  deg: number;
}

interface Sys {
  type: number;
  id: number;
  country: string;
  sunrise: number;
  sunset: number;
}

interface CurrentWeather {
  main: {
    feels_like: number;
    grnd_level: number;
    humidity: number;
    pressure: number;
    sea_level: number;
    temp: number;
    temp_max: number;
    temp_min: number;
  };
  weather: Weather[];
  wind: Wind;
  sys: Sys;
  name: string;
  timezone: number;
  visibility: number;
  dt: number;
  coord: {
    lon: number;
    lat: number;
  };
  clouds: {
    all: number;
  };
  base: string;
  cod: number;
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("disaster-list");
  interface WeatherData {
    city: {
      sunrise: number;
      sunset: number;
    };
    list: {
      dt: number;
      dt_txt: string;
      main: {
        temp: number;
      };
    }[];
  }

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(
    null
  );

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    if (loggedIn !== "true") {
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch(
          "https://api.openweathermap.org/data/2.5/forecast?lat=23.746466&lon=90.376015&appid=e614f366afcadbe875379ef299e9198e"
        );
        const data = await response.json();
        console.log(data);
        setWeatherData(data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchWeatherData();
  }, []);

  useEffect(() => {
    const fetchCurrentWeather = async () => {
      try {
        const response = await fetch(
          "https://api.openweathermap.org/data/2.5/weather?lat=23.746466&lon=90.376015&appid=e614f366afcadbe875379ef299e9198e"
        );
        const data = await response.json();
        setCurrentWeather(data); // Process the current weather data as needed
        console.log(currentWeather);
      } catch (error) {
        console.error("Error fetching current weather data:", error);
      }
    };

    fetchCurrentWeather();
  }, []);

  const navigate = useNavigate();

  const userLoggedIn = localStorage.getItem("loggedIn");
  return (
    <>
      <Navbar />
      <div className="p-8 px-12 mx-auto">
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold mb-6">Disaster Alert Dashboard</h1>
          <div className="flex gap-4">
            {userLoggedIn !== "true" && (
              <Button
                variant={"outline"}
                onClick={() => {
                  navigate("/login");
                }}
              >
                Login
              </Button>
            )}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg w-64 text-center mb-6">
          <div className="text-gray-500 text-xs font-semibold uppercase">
            Sunrise & Sunset
          </div>
          <div className="mt-4">
            <div className="text-gray-900 mt-2 font-semibold">
              Sunrise: {moment(weatherData?.city?.sunrise).format("h:mm A")}
            </div>
            <div className="text-gray-900 mt-2 font-semibold">
              Sunset: {moment(weatherData?.city?.sunset).format("h:mm A")}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg w-64 text-center">
          <div className="text-gray-500 text-xs font-semibold uppercase">
            Current Weather
          </div>
          <div className="mt-4">
            <div className="text-5xl font-bold mt-4">
              {currentWeather
                ? (currentWeather.main.temp - 273.15).toFixed(0)
                : ""}
              <span className="text-xl align-top">°C</span>
            </div>

            <div className="text-gray-500 text-sm mt-2">
              RealFeel®{" "}
              {currentWeather
                ? (currentWeather.main.feels_like - 273.15).toFixed(0)
                : ""}
              °
            </div>

            <div className="text-gray-900 mt-2 font-semibold">
              {currentWeather?.weather[0].main}
            </div>
          </div>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="mb-4">
            <TabsTrigger value="hourly-weather">Hourly Weather</TabsTrigger>
            <TabsTrigger value="disaster-list">
              Recent And Upcoming Disaster
            </TabsTrigger>
          </TabsList>

          <TabsContent value="hourly-weather">
            {weatherData && weatherData.list && (
              <div className="grid grid-cols-3 gap-4">
                {weatherData.list.map((weather) => (
                  <div
                    key={weather.dt}
                    className="bg-white p-6 rounded-lg shadow-lg text-center"
                  >
                    <div className="text-gray-500 text-xs font-semibold uppercase">
                      {moment(weather.dt_txt).format("ddd, hA")}
                    </div>
                    <div className="mt-4">
                      <Cloud className="w-8 h-8 mx-auto" />
                      <div className="text-gray-900 mt-2 font-semibold">
                        {Number(weather.main.temp - 273).toFixed()}°C
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="disaster-list">
            <DisasterTable />
          </TabsContent>

          <TabsContent value="admin">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Info className="mr-2" />
                  Admin Controls
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Admin features would go here, such as:</p>
                <ul className="list-disc list-inside">
                  <li>Manage disaster information</li>
                  <li>User management</li>
                  <li>Send notifications</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Dashboard;
