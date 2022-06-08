import React, {Component} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Globals from "../../util/Globals";
import moment from "moment";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faArrowDown, faArrowUp} from '@fortawesome/free-solid-svg-icons'

const axios = require('axios');

class Landing extends Component {
    constructor() {
        super();
        this.state = {
            profile: "",
            reviews: [],
            errors: [],
            reviewCount: 0,
        }
        this.vote = this.vote.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.onChange = this.onChange.bind(this);
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


    handleKeyPress = (event) => {
        let self = this;
        if (event.key === 'Enter') {
            console.log("yes");

            axios.get(Globals.serviceUrl + 'p/' + self.state.profile)
                .then(function (response) {
                    self.setState({"errors": {}});
                    self.setState({reviews: response.data.reviewDtoList});
                    self.setState({reviewCount: response.data.reviewCount});
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
                        onKeyDown={this.handleKeyPress}
                        aria-label="Search"/>


                    <div className={"reviews-container"}>

                        <span className={"review-count"}> {this.state.reviewCount} yorum listeleniyor</span>
                        {this.state.reviews.map(function (review) {

                            let date = moment(review.createdAt).format("YY-MM-DD HH:MM");

                            return (<div className={"col-10 offset-1 review-text"}>
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

                </div>


            </div>
        )
    };
}

export default Landing;