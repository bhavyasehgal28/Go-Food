import React from 'react'

export default function Carousel() {
    return (
        <div>

            <div id="carouselExampleFade" className="carousel slide carousel-fade " data-bs-ride="carousel">

                <div className="carousel-inner " id='carousel'>
                    <div class=" carousel-caption  " style={{ zIndex: "0" }}>
                        <form className=" d-flex justify-content-center">  {/* justify-content-center, copy this <form> from navbar for search box */}
                            <input className="form-control me-2 w-75 bg-white text-dark" type="search" placeholder="Type in..." aria-label="Search" />
                            <button className="btn text-white bg-success" type="submit">Search</button>
                        </form>
                    </div>
                    <div className="carousel-item active" >
                        <img src="https://mdbootstrap.com/img/Photos/Slides/img%20(46).jpg" className="d-block w-100  " style={{ filter: "brightness(100%)" }} alt="..." />
                    </div>
                    <div className="carousel-item">
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7MqJ3xxxEjS2k7OlyDholVxifhqetQMOQowlGGm-wH-9_cv1GA59MP_IgwxLxsSSX40A&usqp=CAU" className="d-block w-100 " style={{ filter: "brightness(100%)" }} alt="..." />
                    </div>
                    <div className="carousel-item">
                        <img src="https://mdbcdn.b-cdn.net/img/Photos/Slides/img%20(88).webp" className="d-block w-100 " style={{ filter: "brightness(100%)" }} alt="..." />
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
    )
}
