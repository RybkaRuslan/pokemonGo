import React, { useState, useEffect } from "react";
import { IPokemon } from "../../types/types";
import { Button, Card, CardContent, Grid, Typography } from "@mui/material";
import CircularWithValueLabel from "./progress/progress";

export default function OnePokemon() {
  const [pokemon, setPokemon] = useState<IPokemon[]>([]); // для списка покемонов
  const [offset, setOffset] = useState<number>(0); // параметр запроса
  const [limit, setLimit] = useState<number>(12); // параметр запроса
  const [isLoading, setIsLoading] = useState<boolean>(true); // для лоадера

  useEffect(() => {
    const fetchPokemon = async (): Promise<void> => {
      // асинхронный запрос для загрузки покемонов
      try {
        const res = await fetch(
          `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
        );
        const data = await res.json();
        const searchResults: IPokemon[] = data.results;
        setPokemon(searchResults); // данные устанавливаются в состояние
        setIsLoading(false); 
      } catch (error) {
        console.error("Ошибка при получении информации о покемонах:", error);
        setIsLoading(false); // isLoading  становится false после успешной загрузки или в случае ошибки
      }
    };
    fetchPokemon();
  }, [offset, limit]); // запрос на загрузку покемонов при монтировании компонента

    const handleNextPage = () => {
      setOffset(offset + limit);
    };

  if (isLoading) {
    return <CircularWithValueLabel />;
  }

  return (
    <div>
      <Grid container spacing={2}>
        {pokemon.map((el: IPokemon, index: number) => (
          <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
            <Card key={index}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {el.name}
                </Typography>
                <Typography variant="body1">Вес: ед.</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Button variant="contained" color="primary" onClick={handleNextPage}>
        Следующая страница
      </Button>
    </div>
  );
}
