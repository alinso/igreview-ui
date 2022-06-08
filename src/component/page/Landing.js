import React, {Component} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Globals from "../../util/Globals";
import moment from "moment";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faAnglesLeft, faAnglesRight, faArrowDown, faArrowUp} from '@fortawesome/free-solid-svg-icons'

const axios = require('axios');

class Landing extends Component {
    constructor() {
        super();
        this.state = {
            profile: "",
            newReview: "",
            reviews: [],
            newReviewAreaVisible: false,
            reviewCountAreaVisible: false,
            errors: [],
            pageNum: 0,
            reviewCount: 0,
        }
        this.vote = this.vote.bind(this);
        this.loadReviews = this.loadReviews.bind(this);
        this.onChange = this.onChange.bind(this);
        this.saveReview = this.saveReview.bind(this);
        this.changePage=this.changePage.bind(this);

    }

    changePage(pageNum) {
        let self = this;
        if(pageNum<0)
            pageNum=0;

        if(pageNum>this.state.reviewCount/5)
            pageNum=this.state.reviewCount/5;


            axios.get(Globals.serviceUrl + 'p/' + self.state.profile+"/"+pageNum)
                .then(function (response) {
                    self.setState({"errors": {}});
                    self.setState({reviews: response.data.reviewDtoList});
                    self.setState({reviewCount: response.data.reviewCount});
                    self.setState({newReviewAreaVisible: true});
                    self.setState({reviewCountAreaVisible: true});
                    self.setState({pageNum:pageNum});
                })
                .catch(function (error) {
                    self.setState({"errors": error.response.data});
                });
        }



    saveReview() {
        let self = this;
        let reviewData = {
            review: self.state.newReview,
            igProfileName: self.state.profile
        }
        axios.post(Globals.serviceUrl + 'review/', reviewData)
            .then(function (response) {
                const newReviews = [...self.state.reviews];
                newReviews.push(response.data);
                self.setState({reviews: newReviews});
                self.setState({reviewCount: self.state.reviewCount + 1});
                self.setState({newReviewAreaVisible: false});
            })
    }


    vote(vote, reviewId) {

        const voteData = {
            reviewId: reviewId,
            voteValue: vote
        }
        let self = this;
        axios.post(Globals.serviceUrl + 'vote/', voteData)
            .then(function (response) {

                let updatedReviews = [...self.state.reviews]
                let i;
                for (i = 0; i < updatedReviews.length; i++) {
                    if (updatedReviews[i].id == voteData.reviewId) {
                        break;
                    }
                }
                updatedReviews[i].voteSum = response.data;
                self.setState({reviews: updatedReviews});
            })
    }


    loadReviews = (event) => {
        let self = this;
        if (event.key === 'Enter') {
            console.log("yes");

            axios.get(Globals.serviceUrl + 'p/' + self.state.profile)
                .then(function (response) {
                    self.setState({"errors": {}});
                    self.setState({reviews: response.data.reviewDtoList});
                    self.setState({reviewCount: response.data.reviewCount});
                    self.setState({newReviewAreaVisible: true});
                    self.setState({reviewCountAreaVisible: true});
                })
                .catch(function (error) {
                    self.setState({"errors": error.response.data});
                });
        }
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    render() {
        let self = this;
        return (
            <div className="row app-container">
                <div className={" col-md-6 offset-md-3 col-10 offset-1"}>
                    <br/><br/>
                    <h6 className={"landing-title"}>instagram profil yorumları</h6>
                    <span className={"landing-exp"}>bir instagram profiline yorum yapabilir veya yorumları okuyabilirsin.
                    merak ettiğin kişinin IG profilini yaz, enterle, insanlar ne diyor öğren</span>
                    <input
                        className="form-control"
                        type="search"
                        placeholder="Orn : kimkardasian"
                        name="profile"
                        onChange={this.onChange}
                        value={this.state.profile}
                        onKeyDown={this.loadReviews}
                        aria-label="Search"/>


                    <div className={"reviews-container"}>
                        {this.state.reviewCountAreaVisible && this.state.reviews.length > 0 && (
                            <div className={"review-count"}>
                                <br/>
                                <span> toplam {this.state.reviewCount} yorum</span> &nbsp;&nbsp;&nbsp;

                                <span onClick={()=>this.changePage(0)}> ilk sayfa</span> &nbsp;
                                <span onClick={()=>this.changePage(this.state.pageNum-1)}> <FontAwesomeIcon icon={faAnglesLeft}/> onceki</span> &nbsp;
                                <span onClick={()=>this.changePage(this.state.pageNum+1)}> sonraki <FontAwesomeIcon icon={faAnglesRight}/></span> &nbsp;
                                <span onClick={()=>this.changePage(this.state.reviewCount/5)}> son sayfa</span>
                            </div>
                        )}
                        <br/>
                        {this.state.reviews.map(function (review) {
                            let date = moment(review.createdAt).format("YY-MM-DD HH:MM");

                            return (<div className={"col-12  review-text"}>
                                    {review.review}
                                    <br/>
                                    <span className={"review-date"}>{date}</span>
                                    &nbsp;&nbsp;&nbsp;
                                    <FontAwesomeIcon icon={faArrowUp} className={"voteIcon"}
                                                     onClick={() => self.vote("UP", review.id)}/>
                                    &nbsp;&nbsp;&nbsp;
                                    <FontAwesomeIcon icon={faArrowDown} className={"voteIcon"}
                                                     onClick={() => self.vote("DOWN", review.id)}/> (<span
                                    id={"voteSum" + review.id}>{review.voteSum}</span>)
                                    <br/><br/>
                                </div>
                            )
                        })}
                    </div>
                    <br/>
                    {this.state.reviews.length == 0 && this.state.newReviewAreaVisible && (
                        <span className={"landing-exp"}>bu profile henüz kimse yorum yapmamış:(</span>
                    )}
                    {this.state.newReviewAreaVisible && (
                        <div><textarea
                            className="form-control"
                            placeholder={"anonim bir yorum bırak..."}
                            name="newReview"
                            onChange={this.onChange}
                            value={this.state.newReview}
                            aria-label="Search"/>
                            <br/>
                            <button onClick={this.saveReview} className={"btn btn-primary"}>yorumu kaydet</button>
                        </div>
                    )}
                </div>


            </div>
        )
    };
}

export default Landing;