import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
// import Carousel from '../components/Carousel'
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function Home() {
  const [foodCat, setFoodCat] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [search, setSearch] = useState('');

  const loadFoodItems = async () => {
    try {
      let response = await fetch("http://localhost:5000/api/auth/foodData", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      let data = await response.json();
      setFoodItems(data[0]);
      setFoodCat(data[1]);
    } catch (error) {
      console.error("Error fetching food data:", error);
    }
  };

  useEffect(() => {
    loadFoodItems();
  }, []);

  return (
    <div>
      <Navbar />
      <div>
        <div id="carouselExampleFade" className="carousel slide carousel-fade" data-bs-ride="carousel">
          <div className="carousel-inner" id='carousel'>
            <div className="carousel-caption" style={{ zIndex: "9" }}>
              <div className="d-flex justify-content-center">
                <input
                  className="form-control me-2 w-75 bg-white text-dark"
                  type="search"
                  placeholder="Search in here..."
                  aria-label="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button className="btn text-white bg-danger" onClick={() => setSearch('')}>X</button>
              </div>
            </div>
            <div className="carousel-item active">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSK-n2d-JVmxfBdtVu4ZZwGcB_8yGDQaty0g&s" className="d-block w-100" style={{ filter: "brightness(30%)" }} alt="..." />
            </div>
            <div className="carousel-item">
              <img src="https://media.istockphoto.com/id/1493889527/photo/cropped-image-of-an-asian-woman-using-tongs-to-pick-up-an-almond-croissant-from-a-bakery-store.jpg?s=2048x2048&w=is&k=20&c=-tnXcfuD0QxeTTneUOHfyrqdaD4GeEJ_uvdOnba60DA=" className="d-block w-100" style={{ filter: "brightness(30%)" }} alt="..." />
            </div>
            <div className="carousel-item">
              <img src="https://media.istockphoto.com/id/1889872032/photo/man-using-tongs-to-take-meat-off-grill.jpg?s=2048x2048&w=is&k=20&c=jBYu4At45KtoWZ_WqGtU0WikBH8rMR1nalngJ7Wvwng=" className="d-block w-100" style={{ filter: "brightness(30%)" }} alt="..." />
            </div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
      <div className='container'>
        {foodCat.length > 0 ? foodCat.map((data) => (
          <div key={data.id} className='row mb-3'>
            <div className='fs-3 m-3'>
              {data.CategoryName}
            </div>
            <hr id="hr-success" style={{ height: "4px", backgroundImage: "-webkit-linear-gradient(left,rgb(0, 255, 137),rgb(0, 0, 0))" }} />
            {foodItems.length > 0 ? foodItems.filter(
              (item) => item.CategoryName === data.CategoryName && item.name.toLowerCase().includes(search.toLowerCase())
            ).map(filteredItem => (
              <div key={filteredItem.id} className='col-12 col-md-6 col-lg-3'>
                <Card foodName={filteredItem.name} item={filteredItem} options={filteredItem.options[0]} ImgSrc={filteredItem.img} />
              </div>
            )) : <div>No Such Data</div>}
          </div>
        )) : ""}
      </div>
      <Footer />
    </div>
  );
}