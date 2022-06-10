import React, {Component} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Globals from "../../util/Globals";
import moment from "moment";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faAnglesLeft, faAnglesRight, faArrowDown, faArrowUp, faTrashCan} from '@fortawesome/free-solid-svg-icons'

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
            lastReviews: [],
            reviewCount: 0,
        }
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.deleteReview = this.deleteReview.bind(this);
        this.vote = this.vote.bind(this);
        this.loadReviews = this.loadReviews.bind(this);
        this.onChange = this.onChange.bind(this);
        this.saveReview = this.saveReview.bind(this);
        this.changePage = this.changePage.bind(this);
        this.last5Reviews = this.last5Reviews.bind(this);
        this.handleReviewClick = this.handleReviewClick.bind(this);
        this.last5Reviews();
    }

    changePage(pageNum) {
        let self = this;
        if (pageNum < 0)
            pageNum = 0;

        if (pageNum > this.state.reviewCount / 5)
            pageNum = this.state.reviewCount / 5;


        axios.get(Globals.serviceUrl + 'p/' + self.state.profile + "/" + pageNum)
            .then(function (response) {
                self.setState({"errors": {}});
                self.setState({reviews: response.data.reviewDtoList});
                self.setState({reviewCount: response.data.reviewCount});
                self.setState({newReviewAreaVisible: true});
                self.setState({reviewCountAreaVisible: true});
                self.setState({pageNum: pageNum});
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

    last5Reviews() {

        let self = this;
        axios.get(Globals.serviceUrl + 'review')
            .then(function (response) {

                self.setState({lastReviews: response.data});
            });
    }

    loadReviews() {

        let self = this;
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

    handleReviewClick(pName) {
        this.setState({profile: pName}, this.loadReviews);
    }

    handleKeyDown = (event) => {
        this.setState({newReviewAreaVisible: false});
        if (event.key === 'Enter') {
            let cleanProfile= this.state.profile.replace("@","");
            this.setState({profile:cleanProfile},this.loadReviews)
        }
    }

    deleteReview(id) {

        if (!window.confirm("bu yorumu silmek istiyor musun"))
            return;
        axios.delete(Globals.serviceUrl + 'review/' + id)
            .then(function (response) {
                alert("yorum silindi");
            }).catch(function (res) {
            alert("yorumu sadece yazan kişi silebilir. aynı zamanda yeterince olumsuz oy alan yorumlar da silinir")
        });
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    render() {
        let self = this;
        return (
            <div className="row app-container">
                <div className={" col-md-6 offset-md-3 col-10 offset-1"}>
                    <img src={"instalogo.png"}/>
                    <br/><br/>
                    <h6 className={"landing-title"}>instagram profil yorumları</h6>
                    <span className={"landing-exp"}>bir instagram profiline yorum yapabilir veya yorumları okuyabilirsin.
                    merak ettiğin kişinin IG profilini yaz, enterle, insanlar ne diyor öğren</span><br/><br/>
                    <div className={"row"}>
                        <div className={"col-9"}>
                            <input
                                className="form-control"
                                type="search"
                                placeholder="Orn : kyliejenner"
                                name="profile"
                                onChange={this.onChange}
                                value={this.state.profile}
                                onKeyDown={this.handleKeyDown}
                                aria-label="Search"/>
                        </div>
                        <div className={"col-2"}>
                            <button onClick={this.loadReviews} className={"btn btn-success"}>ara</button>
                        </div>
                    </div>
                    <div className={"reviews-container"}>
                        {this.state.reviewCountAreaVisible && this.state.reviews.length > 0 && (
                            <div className={"review-count"}>
                                <br/>
                                <span> toplam {this.state.reviewCount} yorum</span> &nbsp;&nbsp;&nbsp;

                                <span onClick={() => this.changePage(0)}> ilk sayfa</span> &nbsp;
                                <span onClick={() => this.changePage(this.state.pageNum - 1)}> <FontAwesomeIcon
                                    icon={faAnglesLeft}/> onceki</span> &nbsp;
                                <span onClick={() => this.changePage(this.state.pageNum + 1)}> sonraki <FontAwesomeIcon
                                    icon={faAnglesRight}/></span> &nbsp;
                                <span onClick={() => this.changePage(this.state.reviewCount / 5)}> son sayfa</span>
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
                                    id={"voteSum" + review.id}>{review.voteSum}</span>)&nbsp;&nbsp;
                                    <span onClick={() => self.deleteReview(review.id)}><FontAwesomeIcon
                                        icon={faTrashCan}/></span>
                                    <br/><br/>
                                </div>
                            )
                        })}
                    </div>
                    <br/>
                    {this.state.reviewCountAreaVisible && this.state.reviews.length > 0 && (
                        <div className={"review-count"}>
                            <br/>
                            <span> toplam {this.state.reviewCount} yorum</span> &nbsp;&nbsp;&nbsp;

                            <span onClick={() => this.changePage(0)}> ilk sayfa</span> &nbsp;
                            <span onClick={() => this.changePage(this.state.pageNum - 1)}> <FontAwesomeIcon
                                icon={faAnglesLeft}/> onceki</span> &nbsp;
                            <span onClick={() => this.changePage(this.state.pageNum + 1)}> sonraki <FontAwesomeIcon
                                icon={faAnglesRight}/></span> &nbsp;
                            <span onClick={() => this.changePage(this.state.reviewCount / 5)}> son sayfa</span>
                        </div>
                    )}
                    {this.state.reviews.length == 0 && this.state.newReviewAreaVisible && (
                        <span className={"landing-exp"}><strong>@{this.state.profile}</strong> için henüz kimse yorum yapmamış:(</span>
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
                            <button onClick={this.saveReview} className={"btn btn-success"}>yorumu kaydet</button>
                        </div>
                    )}

                    <hr/>
                    <h6 className={"landing-title"}>son yazılanlar</h6>
                    {this.state.lastReviews.map(function (review) {
                        let date = moment(review.createdAt).format("YY-MM-DD HH:MM");

                        return (<div className={"col-12  review-text"}>
                                <strong onClick={() => self.handleReviewClick(review.igProfileName)}>@{review.igProfileName} için</strong> : {review.review}
                                <br/>
                                <span className={"review-date"}>{date}</span>
                                <br/><br/>
                            </div>
                        )
                    })}
                </div>

            </div>
        )
    };
}

export default Landing;