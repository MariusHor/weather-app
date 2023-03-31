import FavoriteCard from './Card.favorite';

const FavoritesContainer = favorites => `
    <div class="h-fit flex flex-wrap items-center text-slate-200 justify-center gap-2 p-4">
        ${favorites.map(favorite => FavoriteCard(favorite)).join('')}
    </div>
`;

export default FavoritesContainer;
