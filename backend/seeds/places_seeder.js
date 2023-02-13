/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('places').del()
  await knex('places').insert([
    {id: 1, title: 'Yerevan'},
    {id: 2, title: 'New York'},
    {id: 3, title: 'Moscow'},
    {id: 4, title: 'Barcelona'},
    {id: 5, title: 'Madrid'},
    {id: 6, title: 'Aleppo'},
    {id: 7, title: 'Amsterdam'},
    {id: 8, title: 'Voronej'},
    {id: 9, title: 'Caxkadzor'},
    {id: 10, title: 'Detroit'},
  ]);
};
