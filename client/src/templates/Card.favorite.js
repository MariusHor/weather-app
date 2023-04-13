const FavoriteCard = favorite => `
        <div class="favorite-card h-fit rounded-lg text-slate-800 text-xs overlay bg-slate-200 text-center">
            <button class="h-full w-full" data-btn="favorite-tag" data-tag="${favorite.tag}">
                <p class="m-3">${favorite.tag}</p>    
            </button>       
        </div>
    `;

export default FavoriteCard;
