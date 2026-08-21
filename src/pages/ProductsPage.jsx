import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductIntro from '../components/Products/ProductIntro';
import ProductFilters from '../components/Products/ProductFilters';
import ProductGrid from '../components/Products/ProductGrid';
import Pagination from '../components/Products/Pagination';
import '../styles/animations.css';

const PRODUCTS = [
  {
    id: 1,
    name: 'Aurelia Nocturn',
    house: 'DCarlem',
    family: 'Oriental & Spicy',
    price: 285,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCv8oeO5FBUlX4jvAFp_JR0LAGKZAn-eKsx25m_cOqT4LCV_taip1UI0qia81ECIRqb7ObLVHEToUy1Zp010Ch5AgPvo6H13JAqiB9PxQFLV364LqC5H4f3KVx36mxaXOhew5EH1Dq_leCUpWoDKe-bsIVdijbnT-NCTwrupdjir9-VHIY7NzD8fzRdNHRp17hFV_9owYn7oHf5sj1TCZALV7p4296Hpg_sOYZ4fY-J6Q9q_kDL2JOI',
  },
  {
    id: 2,
    name: 'Floral & Ethereal',
    house: 'Maison Alchemy',
    family: 'White Florals',
    price: 210,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqQdUvsIUkEVk4fpTbdhYpFiokpzgpO51GZ8LU0Jvo1vD5g90jiUIXIm9A0lRoI5xYp_W-p9v6BweqRsbCx5UmwrMxmVqvZKlDpvBS24aLO4wC3LVIG7ZuuUkqltjef2Rh5QjA011lIrykJKtupm5-RJtc1g7YB9oxiGf1dqVTu_T1-UXZJR7ZzK0rGOfTv7SsjPIZ0HybPWfHeo8Jxo2O4vSyh-mAMsiKQDFvtfofPj5xDhuoaBq4',
  },
  {
    id: 3,
    name: 'Oud Mystique',
    house: 'DCarlem',
    family: 'Woody & Rich',
    price: 320,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBy_G2LsBaoTA-nEMEkATep7pHXXA8WbCjbCq72ZNVtjovfBrkquMN9I65Ctd4VhIE5WfIs_bE1JPMOcZVK-HKr3pRZM1SJPISFdkzas8Qov73xfU57B9uaRDcT6CMjuXr-O0wxNzmjwC3dyS54FNWpEMloYIui3IbGXE3FAcF0cz8Y_rjq3rCq5xN6M8ILYosWfSUOIGExKpShALAgL5lfIRA3hL1688C15cfq5hje-eeDoPqkCE61',
  },
  {
    id: 4,
    name: 'Santal Velvet',
    house: 'Aura & Essence',
    family: 'Warm Woods',
    price: 195,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmR77NLlIr2eWod_Pu29SMeZ1-vIoZsPLu2w-hs0yZK94-SCYBDIZ1YN_BaWSwh8M4ZVbjzXq8KWQ9pQt10JGcrXJ5N3P8K-in1mjpkkcMhlZlzf0kiUzykff6go9hmwXeH0A438LxTdIksvPejcK4VjkQYt20Gf6lGS9TsMhcb-9Av9w2DE1kUbYrALJKPiXroYbQ9__1UoTsMAm7-oi24w4s5n9fQLY9OjkezSQaIzVNYEnfG2JK',
  },
  {
    id: 5,
    name: 'Bergamot Dawn',
    house: 'Maison Alchemy',
    family: 'Fresh Citrus',
    price: 175,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBr84u2XBFAATYgNPk6LaozT1nb7eSVUdoDoIxPT6gP4IOU0NOHf1fvTuoRLemXkbKi-ayUQfcJQOEaGTcyD__yVStDr7RNwTHRU_wSwIirFqnDpYyNcOXFg7A4ADNNkcWji4Mhbjii0rx6uHtXHPqToitSKXRIHU9eJj8a5jITIkBdWyBio6w6GTk1rHreQQGaD-e0Ny4DPhKjlZxsuxlGw6Xj1Fyuth1OBDfmIOtM_JbUyknHMTYb',
  },
  {
    id: 6,
    name: 'Crimson Rose',
    house: 'DCarlem',
    family: 'Rich Floral',
    price: 250,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyNTLNOci229WQbIJVDvgIxD41ZQVE1lMK8xcdWjfl7oJBiekj3j17jo9b37xBUHn7EaK6wHaDfdAnRVyih5bWMb8i2BDWb8ooI9vvmI-jlUpCMqvh5mBUlWyNPL6YLJvSnGikjBNc1NNAkCYzVLOFHMt1Hhw2d2kOeVqN-tdepK6_gOcupjVvBF6ETcFmT7dwx0-mc4CSaTX2Ga6a4oq7zAhAX1ouTrQzUfZ8Y1MdP7Eb8y233YKI',
  },
];

export default function ProductsPage() {
  const [scrolled, setScrolled] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [selectedHouses, setSelectedHouses] = useState(['DCarlem']);
  const [selectedFamily, setSelectedFamily] = useState('Floral');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleHouseChange = (house) => {
    setSelectedHouses((prev) =>
      prev.includes(house)
        ? prev.filter((h) => h !== house)
        : [...prev, house]
    );
  };

  return (
    <div className="bg-surface font-body-md text-on-surface">
      <Header scrolled={scrolled} activePage="products" />
      <main className="w-full pt-20 bg-surface">
        <div className="flex flex-col w-full">
          <ProductIntro />

          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop w-full grid grid-cols-1 md:grid-cols-12 gap-gutter pb-section-gap items-start">
            <ProductFilters
              sortBy={sortBy}
              setSortBy={setSortBy}
              selectedHouses={selectedHouses}
              handleHouseChange={handleHouseChange}
              selectedFamily={selectedFamily}
              setSelectedFamily={setSelectedFamily}
            />

            <ProductGrid products={PRODUCTS} />
          </div>

          <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
