import {
  bunBottom,
  bunTop,
  burgerConstructor,
  ingredientMain,
  ingredientSauce,
  modal,
  modalCloseButton,
  modalOverlay,
  orderButton,
  orderNumber,
  userName
} from './constants';

describe('Проверка функционала конструктора бургеров', function () {
  beforeEach(() => {
    // Загружаем необходимые моковые данные
    cy.fixture('ingredients.json').as('ingredientsData');
    cy.fixture('user.json').as('user');
    cy.fixture('order.json').as('order');
    // Перехватываем необходимые запросы
    cy.intercept('GET', '/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.intercept('GET', '/api/auth/user', {
      fixture: 'user.json'
    }).as('getUser');
    cy.intercept('POST', `api/orders`, {
      fixture: 'order.json'
    }).as('createOrder');

    cy.visit('/');
    cy.wait('@getIngredients'); // Ждём завершения запроса
  });

  describe('Добавление ингредиентов в конструктор', () => {
    it('отображает ингредиенты и позволяет добавлять их в конструктор', () => {
      // получаем конструктор
      cy.get(burgerConstructor).should('exist');
      // проверяем что в конструкторе нет добавленных булок
      cy.get(burgerConstructor).should('not.contain', '[data-testid=bunTop]');
      cy.get(burgerConstructor).should('not.contain', bunTop);
      // Находим и кликаем на первую кнопку добавить ингредиент
      cy.contains('Добавить').should('exist').click();
      // Проверяем что верхняя булка добавилась
      cy.get(bunTop).should('exist');
      cy.get(bunTop).contains('Краторная булка N-200i (верх)');
      // Проверяем что нижняя булка добавилась
      cy.get(bunBottom).should('exist');
      cy.get(bunBottom).contains('Краторная булка N-200i (низ)');
      // Находим кнопку ингрелдиента начинки и нажимаем на неё
      cy.get(ingredientMain)
        .parent()
        .find('button')
        .contains('Добавить')
        .click();
      // Проверяем что ингредиент начинки добавился в конструктор
      cy.get(burgerConstructor).contains('Биокотлета из марсианской Магнолии');
      // Находим кнопку ингрелдиента соуса и нажимаем на неё
      cy.get(ingredientSauce)
        .parent()
        .find('button')
        .contains('Добавить')
        .click();
      //Проверяем что соус добавился в конструктор
      cy.get(burgerConstructor).contains('Соус Spicy-X');
    });
    describe('Проверяем работу модальных окон', () => {
      it('Открытие модального окна ингредиента', () => {
        // Находим первый ингредиент начинки и кликаем на него
        cy.get(ingredientMain).first().click();
        // Проверяем, что модальное окно открылось
        cy.get(modal).should('be.visible');
        // Находим и кликаем на кнопку закрытия
        cy.get(modalCloseButton).should('exist').click();
        // Проверяем что модальное окно действительно закрылось
        cy.get(modal).should('not.exist');
        // Снова открываем модальное окно
        cy.get(ingredientMain).first().click();
        // Кликаем на оверлей
        cy.get(modalOverlay).click({ force: true });
        // Проверяем что модальное окно действительно закрылось
        cy.get(modal).should('not.exist');
      });
    });
    describe('Проверяем создание заказа', () => {
      beforeEach(() => {
        cy.setCookie('accessToken', 'mockAccessToken');
        cy.setCookie('refreshToken', 'mockRefreshToken');

        cy.visit('/', {
          onBeforeLoad(win) {
            win.localStorage.setItem('accessToken', 'mockAccessToken');
            win.localStorage.setItem('refreshToken', 'mockRefreshToken');
          }
        });
        cy.wait('@getUser'); // Ждём завершения запроса
      });
      it('Проверяем создание заказа', () => {
        // Проверка пользователя
        cy.get(userName).contains('Test Name');
        // Добавляем ингредиенты
        cy.contains('Добавить').should('exist').click();
        cy.get(bunTop).should('exist');
        cy.get(bunBottom).should('exist');
        cy.get(ingredientMain)
          .parent()
          .find('button')
          .contains('Добавить')
          .click();
        cy.get(ingredientSauce)
          .parent()
          .find('button')
          .contains('Добавить')
          .click();
        // Кликаем на кнопку оформить заказ
        cy.get(orderButton).click();
        // Првоеряем что модальное окно открылось
        cy.get(modal).should('be.visible');
        // Проверяем что номер заказа соответствует номеру из моковых данных
        cy.get(orderNumber).should('contain', '12345');
        // Закрываем модальное окно
        cy.get(modalCloseButton).should('exist').click();
        cy.get(modal).should('not.exist');
        cy.get(burgerConstructor).should('not.contain', bunTop);
        cy.get(burgerConstructor).should('not.contain', bunBottom);
        cy.get(burgerConstructor).should('not.contain', ingredientMain);
        cy.get(burgerConstructor).should('not.contain', ingredientSauce);
      });
      afterEach(() => {
        // Очищаем куки и локальное хранилище после выполнения тестов
        cy.clearCookies();
        cy.clearLocalStorage();
      });
    });
  });
});
