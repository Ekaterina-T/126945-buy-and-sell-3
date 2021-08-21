'use strict'

const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const { getRandomInt, shuffle, } = require(`../../utils`);
const { ExitCode } = require('../../constants');

const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;

const TITLES = [
  `Продам книги Стивена Кинга`,
  `Продам новую приставку Sony Playstation 5`,
  `Продам отличную подборку фильмов на VHS`,
  `Куплю антиквариат`,
  `Куплю породистого кота`,
];

const SENTENCES = [
  `Товар в отличном состоянии.`,
  `Пользовались бережно и только по большим праздникам.`,
  `Продаю с болью в сердце...`,
  `Бонусом отдам все аксессуары.`,
  `Даю недельную гарантию.`,
  `Если товар не понравится — верну всё до последней копейки.`,
  `Это настоящая находка для коллекционера!`,
  `Если найдёте дешевле — сброшу цену.`,
  `Таких предложений больше нет!`,
  `При покупке с меня бесплатная доставка в черте города.`,
];

const CATEGORIES = [
  `Книги`,
  `Разное`,
  `Посуда`,
  `Игры`,
  `Животные`,
  `Журналы`,
];

const OfferType = {
  OFFER: `offer`,
  SALE: `sale`,
};

const SumRestrict = {
  MIN: 1000,
  MAX: 100000,
};

const PictureRestrict = {
  MIN: 1,
  MAX: 16,
};

const getPictureFileName = (number) => {
    const id = (number < 10) ? '0' + number : String(number);
    return `item${id}.jpg`;
}

const generateOffers = (count) => (
    Array(count).fill({}).map(() => ({
        type: OfferType[Object.keys(OfferType)[Math.floor(Math.random() * Object.keys(OfferType).length)]],
        title: TITLES[getRandomInt(0, TITLES.length - 1)],
        description: shuffle(SENTENCES).slice(1, 5).join(` `),
        sum: getRandomInt(SumRestrict.MIN, SumRestrict.MAX),
        picture: getPictureFileName(getRandomInt(PictureRestrict.MIN, PictureRestrict.MAX)),
        category: [CATEGORIES[getRandomInt(0, CATEGORIES.length - 1)]],
    }))
);

module.exports = {
    name: `--generate`,
    async run(count) {
        const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;

        if(count > 1000) {
            console.error(chalk.red('Не больше 1000 объявлений'));
            process.exit(ExitCode.failure);
        }

        const content = JSON.stringify(generateOffers(countOffer));   
        
        try {
          await fs.writeFile(FILE_NAME, content);          
          console.info(chalk.green(`Operation success. File created.`));
          process.exit(ExitCode.success);

        } catch(e) {
          console.error(chalk.red(`Can't write data to file...`));
          console.error(chalk.red(e));
          process.exit(ExitCode.failure);
        }
    }
};