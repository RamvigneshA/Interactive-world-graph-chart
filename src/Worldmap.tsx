 // @ts-nocheck
import axios from 'axios';
import WorldMap from 'react-svg-worldmap';
import { useState, useEffect } from 'react';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import { Legend, YAxis } from 'recharts';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
 // @ts-nocheck
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

interface PopulationYear {
  year: number;
  code: string;
  population: number | null;
}

interface CountryData {
  name: string;
  code: string;
  populationYears: PopulationYear[];
}


function Worldmap() {
  const [countryData, setCountryData] = useState<CountryData[]>([]);
  const [code, setCode] = useState<string>('IN');
  const [data, setData] = useState<{ country: string; value: string }[]>([
    { country: 'IN', value: '' },
  ]);

  useEffect(() => {
    // type ApiResponse = WorldBankData[];
    const fetchData = async () => {
      const response = await axios.get(
        `https://api.worldbank.org/v2/country/${code}/indicator/SP.POP.TOTL?format=json`
      );
      const countryDataResponse = (await response.data[1]) || null; 
      if (!countryDataResponse) {
        console.log('no data')
      } else {
        const dataObject = {
          name: countryDataResponse[0].country.value,
          code,
          populationYears: countryDataResponse.map((data) => ({
            year: data.date,
            code,
            population: data.value,
          })),
        };
        setCountryData((prevCountries) => [...prevCountries, dataObject]);
      }
     
      
    };

    fetchData();
  }, [code]);
  function transformData(
    data: CountryData[]
  ): { year: number; [key: string]: number | null }[] {
    const result: { year: number; [key: string]: number | null }[] = [];
    const yearMap: {
      [key: number]: { year: number; [key: string]: number | null };
    } = {};

    data.forEach((country) => {
      country.populationYears.forEach((entry) => {
        const { year, population } = entry;

        // Initialize the year object if it doesn't exist
        if (!yearMap[year]) {
          yearMap[year] = { year };
        }

        // Assign the population to the corresponding country
        yearMap[year][country.name] = population !== null ? population : null; // Explicitly handle null
      });
    });

    // Convert the map to an array
    for (const year in yearMap) {
      result.push(yearMap[year]);
    }

    return result;
  }
  const transformedData = transformData(countryData).slice(0, 50);

  const clickAction = ({ countryCode }: { countryCode: string }) => {
    const countryCodePresent = countryData.some(
      (obj) => obj.code === countryCode
    );

    if (!countryCodePresent) {
      setData((prev) => [...prev, { country: countryCode, value: '' }]);
      setCode(countryCode);
    }
  };

  const generateRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const tickFormatter = (value: number) => {
    if (value >= 10000000) return `${(value / 10000000).toFixed(1)} Cr`;
    else if (value >= 100000) return `${(value / 100000).toFixed(1)} L`;
    return value.toString();
  };

  return (
    <div className="container mx-auto lg:flex mb-10 justify-between pl-10 pr-10">
      <div className="container mt-5 lg:mt-0 lg:w-1/2 md:p-5 mx-auto border rounded-2xl">
        <WorldMap
          color=""
          richInteraction={true}
          strokeOpacity={100}
          value-suffix="people"
          size="responsive"
          data={data}
          onClickFunction={clickAction}
        />
        <p className="font-thin pl-5 pr-5  md:font-bold text-sm mt-5">
          "Click on a country on the map to view its population trend over
          time."
        </p>
      </div>

      <div className="lg:w-1/2 ">
        {transformedData.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Population Growth: A Global Perspective</CardTitle>
              <CardDescription>
                Population Trends of Selected Countries (1974-Present)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="container mt-10">
                <LineChart
                  data={transformedData}
                  margin={{ left: 12, right: 12 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="year"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <Legend />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                  {Object.keys(transformedData[0])
                    .filter((k) => k !== 'year')
                    .map((name) => (
                      <Line
                        key={name}
                        type={'monotone'}
                        dataKey={name}
                        stroke={generateRandomColor()}
                        strokeWidth={2}
                        dot={false}
                      />
                    ))}
                  <YAxis tickFormatter={tickFormatter} />
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
