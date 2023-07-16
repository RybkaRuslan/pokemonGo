import React, { useState, useEffect } from "react";
import { IPokemon, IPokemonData } from "../../types/types";
import { Card, CardContent, Grid, Pagination, Typography } from "@mui/material";
import CircularWithValueLabel from "./Progress/Progress";

export default function PokemonList(): JSX.Element {
  const [pokemon, setPokemon] = useState<IPokemon[]>([]); // для списка покемонов
  const [offset, setOffset] = useState<number>(0); // параметр запроса
  const [limit, setLimit] = useState<number>(12); // параметр запроса
  const [isLoading, setIsLoading] = useState<boolean>(true); // для лоадера
  const [page, setPage] = useState<number>(1); // текущая страница

  useEffect(() => {
    const fetchPokemon = async (): Promise<void> => {
      // асинхронный запрос для загрузки покемонов
      try {
        const res = await fetch(
          `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
        );
        const data = await res.json();
        const searchResults: IPokemon[] = data.results;
        // Создаем массив промисов для дозапросов роста и веса каждого покемона
        const promises = searchResults.map(async (pokemon) => {
          const response = await fetch(pokemon.url);
          const pokemonData = await response.json();
          return {
            name: pokemon.name,
            weight: pokemonData.weight,
            height: pokemonData.height,
          };
        });
        // Выполняем все промисы и получаем результаты
        const pokemonsWithData: IPokemonData[] = await Promise.all(promises);

        setPokemon(pokemonsWithData); // данные устанавливаются в состояние
        setIsLoading(false);
      } catch (error) {
        console.error("Ошибка при получении информации о покемонах:", error);
        setIsLoading(false); // isLoading  становится false после успешной загрузки или в случае ошибки
      }
    };
    fetchPokemon();
  }, [offset, limit]); // запрос на загрузку покемонов при монтировании компонента

  const handleNextPage = (page: number): void => {
    setOffset(offset + limit);
    setPage(page + 1);
  };

  const handlePreviousPage = (page: number): void => {
    if (offset - limit >= 0) {
      setOffset(offset - limit);
      setPage(page - 1);
    }
  };

  if (isLoading) {
    return <CircularWithValueLabel />;
  }

  return (
    <div
      className="card-container"
      style={{ display: "flex", flexDirection: "column", gap: "20px" }}
    >
      <Grid
        container
        spacing={2}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {pokemon.map((pokemonData: IPokemon, index: number) => (
          <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
            <Card key={index}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {pokemonData.name}
                </Typography>
                <Typography variant="body1">
                  Вес: {pokemonData.weight} ед.
                </Typography>
                <Typography variant="body1">
                  Рост: {pokemonData.height} ед.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Pagination
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        count={Math.ceil(1118 / limit)} // общее количество страниц (в данном случае 1118 - общее количество покемонов)
        page={page}
        onChange={(event, value) => {
          setOffset((value - 1) * limit);
          setPage(value);
        }}
        color="primary"
      />
    </div>
  );
}
