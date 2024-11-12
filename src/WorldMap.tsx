import axios from 'axios';
import WorldMap from 'react-svg-worldmap';
import { useState, useEffect } from 'react';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import { Bar, BarChart, Legend, YAxis } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';
import { Moon, Sun } from "lucide-react"
 
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
const chartData = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: '#2563eb',
  },
  mobile: {
    label: 'Mobile',
    color: '#60a5fa',
  },
} satisfies ChartConfig;

function Worldmap() {
  const [conutryData, setCountryData] = useState([]);
  const [code, setCode] = useState('IN');
  const [data, setData] = useState([{ country: 'in', value: '' }]);

  // ----------------------------useEffect------------------------------------------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      const Response = await axios.get(
        `https://api.worldbank.org/v2/country/${code}/indicator/SP.POP.TOTL?format=json`
      );
      const CountryData = (await Response.data[1]) || [];
      const dataObject = {
        name: CountryData[0].country.value,
        code,
        populationYears: CountryData.map((data) => {
          return {
            year: data.date,
            code,
            population: data.value,
          };
        }),
      };
      // console.log(dataObject)
      setCountryData((prevCountries) => [...prevCountries, dataObject]); // Update using spread syntax
    };

    fetchData();
  }, [code]);
  // -----------------------------------------------Transform function-----------------------------------------------------------
  function transformData(data) {
    const result = [];

    // Create a map to store populations by year
    const yearMap = {};

    // Iterate through each country's data
    data.forEach((country) => {
      country.populationYears.forEach((entry) => {
        const { year, population, code } = entry;

        // Initialize the year object if it doesn't exist
        if (!yearMap[year]) {
          yearMap[year] = { year };
        }

        // Assign the population to the corresponding country
        yearMap[year][country.name] = population;
      });
    });

    // Convert the map to an array
    for (const year in yearMap) {
      result.push(yearMap[year]);
    }

    return result;
  }
  const transformedData = transformData(conutryData).slice(0, 50);
  // -------------------------------------------------clickAction---------------------------------------------------------------------
  const clickAction = ({ countryCode }) => {
    const countryCodePresent = conutryData.some((object) => {
      return object.code === countryCode;
    });
    if (!countryCodePresent) {
      setData((prev) => {
        return [...prev, { country: countryCode, value: '' }];
      });
      console.log(data);
      setCode(countryCode);
    }
  };
  // -------------------------------------------------color generator----------------------------------------------------------------------------
  const generateRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
  };
  console.log(transformedData);
  return (
    <div className="container mx-auto  lg:flex pl-10 pr-10 ">
      <div className=' lg:w-1/2 md:p-10 mx-auto border rounded-2xl  '>
        <WorldMap
          color=""
          richInteraction="true"
          strokeOpacity="100"
          value-suffix="people"
          size="responsive"
          // backgroundColor="lightblue"
          data={data}
          onClickFunction={clickAction}
        />
        <p className='font-bold mt-5'>"Click on a country on the map to view its population trend over time. Double-click on a region to zoom in for a more detailed view."</p>
      </div>
      <div className='lg:w-1/2'>
      {transformedData?.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Population Growth: A Global Perspective</CardTitle>
            <CardDescription>
              Population Trends of Selected Countries (1974-Present)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <LineChart
                accessibilityLayer
                data={transformedData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="year"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  // tickFormatter={(value) => value.slice(0, 3)}
                />
                <Legend />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                {Object.keys(transformedData[0])
                  .filter((k) => k !== 'year')
                  .map((name, index) => (
                    <Line
                      key={name}
                      type={'monotone'}
                      dataKey={name}
                      stroke={generateRandomColor()}
                      strokeWidth={2}
                      dot={false}
                    />
                  ))}
                <YAxis />
              </LineChart>
            </ChartContainer>
          </CardContent>
          <CardFooter>
            <div className="flex w-full items-start gap-2 text-sm">
              <div className="grid gap-2">
               
                <div className="flex items-center gap-2 leading-none text-muted-foreground">
                  Hover the graph for interactive details
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      ) : (
        <p>No population data available.</p>
        )}
        </div>
    </div>
  );
}

export default Worldmap;


