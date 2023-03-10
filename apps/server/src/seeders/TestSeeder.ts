/* eslint-disable class-methods-use-this */
import { EntityManager } from '@mikro-orm/core';
import { faker, Seeder } from '@mikro-orm/seeder';
import { v4 } from 'uuid'
import hashPassword from '../auth/pass';
import User from '../entities/user';
import Entry from '../entities/entry';
import Book from '../entities/Book';
import Comment from '../entities/Comment';
import Like from '../entities/like';

// eslint-disable-next-line import/prefer-default-export
export class TestSeeder extends Seeder {

  async run(em: EntityManager): Promise<void> {

    await em.nativeDelete(User, {});
    await em.nativeDelete(Entry, {});
    await em.nativeDelete(Like, {});
    await em.nativeDelete(Comment, {});

    const hashedPassword = await hashPassword("teszteles");
    const hashedPassword2 = await hashPassword("teszt_user");

    const userRegisterDate = faker.date.recent(3);
    const user = await em.create(User, {
      createdAt: userRegisterDate,
      updatedAt: userRegisterDate,
      email: "matyi@matyi.hu",
      emailPrivate: false,
      username: "matyi_postman",
      password: hashedPassword,
      unique_code: v4(),
      birthday: new Date("1999.07.20"),
      following: [],
      birthdayPrivate: false,
      role: 'admin'
    }, { managed: true })

    const user2 = await em.create(User, {
      createdAt: userRegisterDate,
      updatedAt: userRegisterDate,
      email: "tesztelo@login.hu",
      emailPrivate: false,
      username: "tesztelo",
      password: hashedPassword2,
      unique_code: v4(),
      following: [],
      birthday: new Date("1999.07.20"),
      birthdayPrivate: false,
      role: 'user'

    }, { managed: true })
    // create 5 users using the faker library

    const users = await Promise.all(
      Array.from({ length: 5 }, () => faker.name.firstName()).map(async (name) => {
        const innerUser = await em.create(User, {
          createdAt: userRegisterDate,
          updatedAt: userRegisterDate,
          email: faker.internet.email(),
          emailPrivate: false,
          username: name.toLowerCase(),
          password: hashedPassword,
          following: [],

          unique_code: v4(),
          birthday: new Date("1999.07.20"),
          birthdayPrivate: false,
          role: 'user'

        }, { managed: true })
        return innerUser;
      }
      )
    );

    const commentingUser = await em.create(User, {
      createdAt: userRegisterDate,
      updatedAt: userRegisterDate,
      email: "komment@matyi.hu",
      emailPrivate: false,
      username: "matyi_commenter",
      password: hashedPassword,
      unique_code: v4(),
      following: [],
      birthday: new Date("1999.07.20"),
      birthdayPrivate: false,
      role: 'user'

    }, { managed: true })

    await em.persistAndFlush(user);
    await em.persistAndFlush(user2);
    await em.persistAndFlush(commentingUser);


    const demoBook = new Book({
      author: "Ernest Cline",
      title: "Ready player one",
      pub_year: 2012,
      moly_id: 160592,
      moly_url: "https://www.moly.hu/",
      cover_url: "https://moly.hu/system/covers/big/covers_361075.jpg"
    });
    const books: Book[] = [
      {
        author: "Asha Lemmie",
        title: "50 sz?? az es??re",
        pub_year: 2020,
        moly_id: 533948,
        moly_url: "https://moly.hu/konyvek/asha-lemmie-otven-szo-az-esore",
        cover_url: "https://moly.hu/system/covers/big/covers_728110.jpg"
      },
      {
        author: "Wolfgang Herrndorf",
        title: "Csikk",
        pub_year: 2020,
        moly_id: 127301,
        moly_url: "https://moly.hu/konyvek/csikk",
        cover_url: "https://moly.hu/system/covers/big/covers_169767.jpg"
      },

      {
        moly_id: 392457,
        author: "Grecs?? Kriszti??n",
        title: "Vera",
        pub_year: 2002,
        moly_url: "https://moly.hu/konyvek/grecso-krisztian-vera",
        cover_url: 'https://moly.hu/system/covers/big/covers_524145.jpg'
      },
      {
        "author": "Delia Owens",
        "title": "Ahol a folyami r??kok ??nekelnek",
        "cover_url": "https://moly.hu/system/covers/big/covers_549198.jpg?1557485532",
        "moly_url": "https://moly.hu/konyvek/delia-owens-ahol-a-folyami-rakok-enekelnek",
        "pub_year": 2018,
        "moly_id": 410654,
      },
      {
        "author": "Margaret Atwood",
        "title": "Testamentumok",
        "cover_url": "https://moly.hu/system/covers/big/covers_561838.jpg?1564076851",
        "moly_url": "https://moly.hu/konyvek/margaret-atwood-testamentumok",
        "pub_year": 2019,
        "moly_id": 419077,
      },
      {
        "author": "Agatha Christie",
        "title": "Gyilkoss??g Mezopot??mi??ban",
        "cover_url": "https://moly.hu/system/covers/big/covers_590806.jpg?1580990293",
        "moly_url": "https://moly.hu/konyvek/agatha-christie-gyilkossag-mezopotamiaban",
        "pub_year": 1936,
        "moly_id": 9498,
      },
      {
        "author": "Z??vada P??ter",
        "title": "Ahol megszakad",
        "cover_url": "https://moly.hu/system/covers/big/covers_463247.jpg?1509388529",
        "moly_url": "https://moly.hu/konyvek/zavada-peter-ahol-megszakad",
        "pub_year": 2012,
        "moly_id": 131463,
      },
      {
        "author": "Sz??csi No??mi",
        "title": "L??nyok ??s asszonyok aranyk??nyve",
        "cover_url": "https://moly.hu/system/covers/big/covers_567518.jpg?1566986524",
        "moly_url": "https://moly.hu/konyvek/szecsi-noemi-lanyok-es-asszonyok-aranykonyve",
        "pub_year": 2019,
        "moly_id": 422684,
      },
      {
        "author": "Fiala Borcsa",
        "title": "Balatoni nyomoz??s",
        "cover_url": "https://moly.hu/system/covers/big/covers_542434.jpg?1553773766",
        "moly_url": "https://moly.hu/konyvek/fiala-borcsa-balatoni-nyomozas",
        "pub_year": 2019,
        "moly_id": 406095,
      },
      {
        "author": "N??dasdy ??d??m",
        "title": "J??l l??that??an l??gok itt",
        "cover_url": "https://moly.hu/system/covers/big/covers_542200.jpg?1553632415",
        "moly_url": "https://moly.hu/konyvek/nadasdy-adam-jol-lathatoan-logok-itt",
        "pub_year": 2019,
        "moly_id": 405959,
      },
      {
        "author": "George R. R. Martin",
        "title": "Tr??nok Harca 1. ",
        "cover_url": "https://moly.hu/system/covers/big/covers_446783.jpg?1512932141",
        "moly_url": "https://moly.hu/konyvek/george-r-r-martin-daniel-abraham-tronok-harca-1",
        "pub_year": 1996,
        "moly_id": 334731,
      },
      {
        "author": "F??bi??n Janka",
        "title": "??rvizi napl??",
        "cover_url": "https://moly.hu/system/covers/big/covers_710221.jpg?1638278895",
        "moly_url": "https://moly.hu/konyvek/fabian-janka-arvizi-naplo",
        "pub_year": 2022,
        "moly_id": 521308,
      },
      {
        "author": "Jane Austen",
        "title": "A klastrom titka",
        "cover_url": "https://moly.hu/system/covers/big/covers_3138.jpg?1423420812",
        "moly_url": "https://moly.hu/konyvek/jane-austen-a-klastrom-titka",
        "pub_year": 1818,
        "moly_id": 10528,
      },
      {
        "author": "Berg Judit",
        "title": "Rumini kapit??ny",
        "cover_url": "https://moly.hu/system/covers/big/covers_395571.jpg?1462969326",
        "moly_url": "https://moly.hu/konyvek/berg-judit-rumini-kapitany",
        "pub_year": 2016,
        "moly_id": 296724,
      },
      {
        "author": "Rick Riordan",
        "title": "A vill??mtolvaj",
        "cover_url": "https://moly.hu/system/covers/big/covers_413197.jpg?1492888127",
        "moly_url": "https://moly.hu/konyvek/rick-riordan-a-villamtolvaj",
        "pub_year": 2005,
        "moly_id": 34954,
      },
      {
        "author": "Kert??sz Erzsi",
        "title": "A h??g??mb fogs??g??ban",
        "cover_url": "https://moly.hu/system/covers/big/covers_415353.jpg?1606582856",
        "moly_url": "https://moly.hu/konyvek/kertesz-erzsi-a-hogomb-fogsagaban",
        "pub_year": 2016,
        "moly_id": 311895,
      },
      {
        "author": "Szerb Antal",
        "title": "A pentragon legenda",
        "cover_url": "https://moly.hu/system/covers/big/covers_736960.jpg?1651389133",
        "moly_url": "https://moly.hu/konyvek/szerb-antal-a-pendragon-legenda",
        "pub_year": 1934,
        "moly_id": 8920,
      },
      {
        "author": "Simon M??rton ",
        "title": "R??k??k esk??v??je",
        "cover_url": "https://moly.hu/system/covers/big/covers_500911.jpg?1531909392",
        "moly_url": "https://moly.hu/konyvek/simon-marton-rokak-eskuvoje",
        "pub_year": 2018,
        "moly_id": 376114,
      },
      {
        "author": "Shannon Hale",
        "title": "A suttog??",
        "cover_url": "https://moly.hu/system/covers/big/covers_1531.jpg?1395343277",
        "moly_url": "https://moly.hu/konyvek/shannon-hale-a-suttogo",
        "pub_year": 2003,
        "moly_id": 16788,
      },
      {
        "author": "Patrick S??skind",
        "title": "A parf??m",
        "cover_url": "https://moly.hu/system/covers/big/covers_11648.jpg?1395346803",
        "moly_url": "https://moly.hu/konyvek/patrick-suskind-a-parfum",
        "pub_year": 1985,
        "moly_id": 11169,
      },
      {
        "author": "Dan Brown",
        "title": "A Da Vinci-k??d",
        "cover_url": "https://moly.hu/system/covers/big/covers_492001.jpg?1526374747",
        "moly_url": "https://moly.hu/konyvek/dan-brown-a-da-vinci-kod",
        "pub_year": 2003,
        "moly_id": 1008,
      },
      {
        "author": "Fjodor Mihailovics Dosztojevszkij",
        "title": "B??n ??s b??nh??d??s",
        "cover_url": "https://moly.hu/system/covers/big/covers_508662.jpg?1536654509",
        "moly_url": "https://moly.hu/konyvek/fjodor-mihajlovics-dosztojevszkij-bun-es-bunhodes",
        "pub_year": 1866,
        "moly_id": 15143,
      },
      {
        "author": "Rejt?? Jen??",
        "title": "Pisztos Fred, a kapit??ny",
        "cover_url": "https://moly.hu/system/covers/big/covers_168821.jpg?1395410146",
        "moly_url": "https://moly.hu/konyvek/rejto-jeno-p-howard-piszkos-fred-a-kapitany",
        "pub_year": 1940,
        "moly_id": 16290,
      },
      {
        "author": "Csuk??s Istv??n",
        "title": "Ny??r a szigeten",
        "cover_url": "https://moly.hu/system/covers/big/covers_175039.jpg?1423220614",
        "moly_url": "https://moly.hu/konyvek/csukas-istvan-nyar-a-szigeten",
        "pub_year": 1975,
        "moly_id": 16349,
      }
    ]
    const tagsArray = [
      "reg??ny, csal??d, magyar".split(', '),
      "reg??ny, csal??d, magyar".split(', '),
      "reg??ny, csal??d, magyar".split(', '),
      "reg??ny, krimi, gyilkoss??g, ??llatvil??g".split(', '),
      "diszt??pia, sci-fi".split(', '),
      "krimi, nyomoz??s, detekt??vt??rt??net".split(', '),
      "kort??rs, vers, magyar".split(', '),
      "t??rsadalomt??rt??net, t??rt??nelem, n??k, sz??zadfordul??".split(', '),
      "ifj??s??gi, kalandreg??ny, bar??ts??g, nyomoz??s".split(', '),
      "kort??rs, vers, magyar".split(', '),
      "fantasy, sci-fi".split(', '),
      "reg??ny, csal??d, napl??reg??ny, t??rt??nelmi reg??ny, romantikus".split(', '),
      "reg??ny, romantikus, 19. sz??zad".split(', '),
      "mesereg??ny, ifj??s??gi, kalandreg??ny".split(', '),
      "fantasy, ifj??s??gi, g??r??g mitol??gia".split(', '),
      "kort??rs, kalandreg??ny, ifj??s??gi, magyar".split(', '),
      "kalandreg??ny, nyomoz??s, szat??ra, rejt??ly, magyar".split(', '),
      "kort??rs, vers, magyar".split(', '),
      "mesereg??ny, ifj??s??gi, kalandreg??ny".split(', '),
      "gyilkoss??g, krimi, reg??ny".split(', '),
      "kalandreg??ny, krimi, nyomoz??s, rejt??ly".split(', '),
      "gyilkoss??g, l??lektani, reg??ny, b??n??z??s".split(', '),
      "kalandreg??ny, humor, krimi, haj??z??s, magyar".split(', '),
      "ifj??s??gi, kalandreg??ny, bar??ts??g, magyar".split(', '),
    ]

    books.forEach(async (book,index) => {
      // create 4 entries with comment by random user from users array
      const tags = tagsArray[index];

      Array.from({ length: 2}, async () => {
        const entryDate = faker.date.soon(1, userRegisterDate.toString());

        const entry = await em.create(Entry, {
          createdAt: entryDate,
          updatedAt: entryDate,
          opinion: faker.lorem.paragraphs(6),
          summary: faker.lorem.paragraphs(4),
          user: users[Math.floor(Math.random() * users.length)],
          tags,
          private: faker.datatype.boolean(),
          showComments: true,
          book,
          comments: []
        })
        const comment = await em.create(Comment, {
          createdAt: entryDate,
          updatedAt: entryDate,
          user: users[Math.floor(Math.random() * users.length)],
          text: faker.lorem.paragraph(1),
          entry
        })
        await Promise.all([
          em.persistAndFlush(entry),
          em.persistAndFlush(comment)
        ])
      })
    });

  }

}
