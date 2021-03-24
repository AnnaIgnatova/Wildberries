const mySwiper = new Swiper('.swiper-container', {
	loop: true,

	// Navigation arrows
	navigation: {
		nextEl: '.slider-button-next',
		prevEl: '.slider-button-prev',
	},
});

// cart

const buttonCart = document.querySelector('.button-cart');
const modalCart = document.querySelector('#modal-cart');
const modalClose = document.querySelector('.modal-close');

const openModal = function() {
	modalCart.classList.add('show');
	
	document.addEventListener('click', function(event) {
	if (event.target.classList.contains('overlay')) closeModal();
})

}

const closeModal = function() {
	modalCart.classList.remove('show');
}

buttonCart.addEventListener('click', openModal);
modalClose.addEventListener('click', closeModal);


// scroll-smooth
{
	const scrollLinks = document.querySelectorAll('a.scroll-link');

	for (const scrollLink of scrollLinks) {
	scrollLink.addEventListener('click', function(event) {
		event.preventDefault();
		const id = scrollLink.getAttribute('href');
		document.querySelector(id).scrollIntoView({
			behavior: 'smooth',
			block: 'start',
		});
	});
}
}

// goods 

const more = document.querySelector('.more');
const navigationLink = document.querySelectorAll('.navigation-link');
const longGoodsList = document.querySelector('.long-goods-list');
const allBtn = document.querySelector('.all-btn');
const btnShowAccesorize = document.querySelector('.button-show-accesorize');
const btnShowClothes = document.querySelector('.button-show-clothes');

const getGoods = async function() {
	const result = await fetch('db/db.json');

	if (!result.ok) {
		throw 'Ошибка' + result.status;
	}
	return result.json();
}
const createCard = function ({label, name, img, description, id, price}) {
	const card = document.createElement('div');
	card.className = 'col-lg-3 col-sm-6';
	
	card.innerHTML = `
		<div class="goods-card">
			${label ? `<span class="label">${label}</span>` : ''}			
			<img src="db/${img}" alt="${name}: Striped Long Sleeve Shirt" class="goods-image">
			<h3 class="goods-title">${name}</h3>			
			<p class="goods-description">${description}</p>			
			<button class="button goods-card-btn add-to-cart" data-id="${id}">
				<span class="button-price">$${price}</span>
			</button>			
		</div>
	`;

	return card;
}

const renderCards = function(data) {
	longGoodsList.textContent = '';
	const cards = data.map(createCard);
	cards.forEach(function (card) {
		longGoodsList.append(card);
	});

	document.body.classList.add('show-goods');
};

const viewAll = function(event) {
	event.preventDefault();
	getGoods().then(renderCards);
}

more.addEventListener('click', viewAll);
allBtn.addEventListener('click', viewAll);

const filterCards = function(field, value) {
	getGoods()
	.then(function (data) {
		const filteredGoods = data.filter(function(good) {
			return good[field] === value;
		});
		return filteredGoods;
	})
	.then(renderCards);
}

navigationLink.forEach(function (link) {
	link.addEventListener('click', function(event) {
		event.preventDefault();
		const field = link.dataset.field;
		const value = link.textContent;
		filterCards(field, value);
	})
})

btnShowAccesorize.addEventListener('click', function(event) {
	event.preventDefault();
	filterCards("category", "Accessories");
});
btnShowClothes.addEventListener('click', function(event) {
	event.preventDefault();
	filterCards("category", "Clothing");
});

