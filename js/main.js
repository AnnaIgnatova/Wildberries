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
const more = document.querySelector('.more');
const navigationLink = document.querySelectorAll('.navigation-link');
const longGoodsList = document.querySelector('.long-goods-list');
const allBtn = document.querySelector('.all-btn');
const btnShowAccesorize = document.querySelector('.button-show-accesorize');
const btnShowClothes = document.querySelector('.button-show-clothes');
const cartTableGoods = document.querySelector('.cart-table__goods');
const cardTableTotal = document.querySelector('.card-table__total');
const cartClean = document.querySelector('.clean-cart');
const cartCountTotal = document.querySelector('.cart-count');

const getGoods = async () => {
	const result = await fetch('db/db.json');

	if (!result.ok) {
		throw 'Ошибка' + result.status;
	}
	return result.json();
}

const cart = {
	cartGoods: [],
	renderCart(){
		cartTableGoods.textContent = '';
		this.cartGoods.forEach(({ id, name, price, count }) => {
			const trGood = document.createElement('tr');
			trGood.className = 'cart-item';
			trGood.dataset.id = id;

			trGood.innerHTML = `
				<tr class="cart-item" data-id="003">
				<td>${name}</td>
				<td>${price}</td>
				<td><button class="cart-btn-minus" data-id="${id}">-</button></td>
				<td>${count}</td>
				<td><button class="cart-btn-plus" data-id="${id}">+</button></td>
				<td>${price * count}</td>
				<td><button class="cart-btn-delete" data-id="${id}">x</button></td>
				</tr>
			`;
			cartTableGoods.append(trGood);
		});

		const totalPrice = this.cartGoods.reduce((sum, item) => {
			return sum + item.price * item.count;
		}, 0);

		const totalCount = this.cartGoods.reduce((sum, item) => {
			return sum + item.count;
		}, 0)

		cardTableTotal.textContent = totalPrice + '$';
		cartCountTotal.textContent = totalCount;

	},
	deleteGood(id){
		this.cartGoods = this.cartGoods.filter(item => id !== item.id);
		this.renderCart();
	},
	minusGood(id){
		for (const item of this.cartGoods) {
			if (item.id === id) {
				if (item.count <= 1) {
					this.deleteGood(id);
				} else {
					item.count--;
				}
				break;
			}
		}
		this.renderCart();
	},
	plusGood(id){
		for (const item of this.cartGoods) {
			if (item.id === id) {
				item.count++;
				break;
			}
		}
		this.renderCart();
	},
	addCartGoods(id){
		const goodItem = this.cartGoods.find(item => item.id === id);
		if (goodItem) {
			this.plusGood(id);
		} else {
			getGoods()
				.then(data => data.find(item => item.id === id))
				.then(({ id, name, price }) => {
					this.cartGoods.push({
						id,
						name,
						price,
						count: 1
					});
				});
		}
	},
}

document.body.addEventListener('click', event => {
	const addToCart = event.target.closest('.add-to-cart');

	if (addToCart) {
		cart.addCartGoods(addToCart.dataset.id);
	}
})

cartTableGoods.addEventListener('click', event => {
	const target = event.target;

	if (target.classList.contains('cart-btn-delete')) {
		cart.deleteGood(target.dataset.id);
	}
	if (target.classList.contains('cart-btn-minus')) {
		cart.minusGood(target.dataset.id);
	}
	if (target.classList.contains('cart-btn-plus')) {
		cart.plusGood(target.dataset.id);
	}
});

cartClean.addEventListener('click', () => {
	cartTableGoods.textContent = '';
	cardTableTotal.textContent = '0$';
})


const openModal = () => {
	cart.renderCart();
	modalCart.classList.add('show');
	
	document.addEventListener('click', function(event) {
	if (event.target.classList.contains('overlay')) closeModal();
	
})

}

const closeModal = () => {
	modalCart.classList.remove('show');
}

buttonCart.addEventListener('click', openModal);
modalClose.addEventListener('click', closeModal);


// scroll-smooth
{
	const scrollLinks = document.querySelectorAll('a.scroll-link');

	for (const scrollLink of scrollLinks) {
	scrollLink.addEventListener('click', event => {
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

const viewAll = event => {
	event.preventDefault();
	getGoods().then(renderCards);
}

more.addEventListener('click', viewAll);
allBtn.addEventListener('click', viewAll);

const filterCards = function(field, value) {
	getGoods()
	.then(data => data.filter((good) => good[field] === value))
	.then(renderCards);
}

navigationLink.forEach(link => {
	link.addEventListener('click', function(event) {
		event.preventDefault();
		const field = link.dataset.field;
		const value = link.textContent;
		filterCards(field, value);
	})
})

btnShowAccesorize.addEventListener('click', event => {
	event.preventDefault();
	filterCards("category", "Accessories");
});
btnShowClothes.addEventListener('click', event => {
	event.preventDefault();
	filterCards("category", "Clothing");
});

