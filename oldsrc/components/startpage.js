import React, { Component } from 'react'
import 'antd/dist/antd.css';
import { Icon, Button, Switch, message, Popconfirm } from 'antd';
import {subredditArray, secondTheme} from '../subreddits'
import logo from '../logo.svg'
import '../App.css'
import {Route, Link } from 'react-router-dom'


// import ArrowKeysReact from 'arrow-keys-react';

const text = 'Are you sure delete this task?';



class Startpage extends Component {
  constructor(props){
    super(props)

    this.state={
    	

    }  
  }


confirm() {
  message.info('Clicked on Yes.');
}

  
  render() {


//					<Popconfirm placement="top" title={text} onConfirm={this.confirm} okText="Yes" cancelText="No">



    return (
	    <div className="wrapperRow">
	   
	      <div className="startWrap">

		      <div className="leftCol">
			      <div className="logoTexts">
				      <h1 className="logo">sliddit. BETA</h1>
				      <p className="sloganText">Scroll millions of gifs, videos & pics</p>
				  </div>

				   <div>
					 <Switch checkedChildren="Autoplay gifs: ON" unCheckedChildren="Autoplay gifs: OFF" 
					    style={{fontSize: '20px !important',backgroundColor: this.props.autoplay===true?'green':'red', 
					    color: 'white'
					    }} onClick={this.props.autoplayPress} value={this.props.autoplay}>
				</Switch>
							<Link to={`/scroll/${this.props.category}`}>
									<Button className="NSFW" onClick={e=>this.props.categorySet(e.target.value)} value="NSFW">
											<h1>NSFW</h1>
									</Button>
									
							</Link> 
							{/* <Link to="/scroll">
										<Button onClick={e=>this.props.categorySet(e.target.value)} value="NSFW" className="smallText">Press here to watch NSFW content!</Button>
									</Link>
							<h2>What is NSFW</h2>
							<p>
								Not safe for work, also called NSFW is a slang on the internet 
								that is used in internet forums, blogs and other community sites. 
								</p>
								<h2>What is the purpose of NSFW</h2>
								<p>	The main purpose for the shorthand tag is to mark URLS and 
									other links (to e.g. videos) that contains nudity, sex, violence and other profanities.
								</p>
								<h2>What does NSFW mean</h2>
								<p>The meaning of the tag comes from that the viewer may not like 
									to be observed watching this content nor is it fitting for a serious environment, such as school or work.
								</p> 
								<h2>How to determine something is NSFW</h2>
								<p>To determine something as NSFW is hard to do objectively 
									as it is a matter that most likely is viewed subjectively, there may for 
								example be humans who think animals are vulgar of sorts and thus find it "NSFW".</p>
							
								<h2>Who uses the term NSFW</h2>
								<p>NSFW has even more relevance to viewers in school, workplaces 
									or other formal settings, for example there may be work rules for surfing the internet for porn.</p>
								
								
								<p>On the 28th of November 2007 Drew Curtis, the founder of Fark.	com tried to trademark the tag/phrase, but the application did not get recognized. </p>
								 */}
						</div>
						
				    <Link to={`/scroll/${this.props.category}`}>  
			       <Button className="randomCat" onClick={e=>this.props.categorySet(e.target.value)} value="Normal">
						 <h1>SFW</h1>
			        </Button>
						
						
							
			        </Link>
							{/* <Link to="/scroll">  
								<Button className="randomCat" onClick={e=>this.props.categorySet(e.target.value)} value="Normal" className="smallText">Press here to watch SFW content!</Button>
							</Link>
							<h2>Watching SFW content online</h2>
							<p>SFW, also called "safe for work". To contrast NSFW, SFW is safe for work and should not include sexual content.</p>
							<Link to="/#"> 
							<div className="leftCol">
							<br/><br/><br/><br/>
							<br/><br/><br/><br/>
							<br/><br/><br/><br/>
							<br/><br/><br/><br/>
							<br/><br/><br/><br/>
						<h2>Instructions and usage</h2>
						<p>To use sliddit.com you can either swipe, use the keyboard arrow keys, W/A/S/D keyboard buttons or click the arrows in the user interface.  </p>
						<p>You can as a user either shuffle by pressing "right" between the different subreddits within your chosen category or go to the next/previous picture/gif/video by scrolling downwards or upwards. 
						If you want to go back to a previous subreddit you scrolled you can just go back by going "left" </p> 
						</div>
				
							</Link> */}
			      </div>
			   <div className="rightCol">
				   <Link to={`/scroll/${this.props.category}`}>
				       <Button className="OTHER1" onClick={e=>this.props.categorySet(e.target.value)} value="Art"> 
							 <h1>ART</h1>
				        </Button>
							
				    </Link>
						{/* <Link to="/scroll">
								<Button  onClick={e=>this.props.categorySet(e.target.value)} value="Art" className="smallText">Press here to watch ART content!</Button>
						</Link>
						
						<h2>Watching art pictures online</h2>
						<p>To watch art online is something that is growing as the internet is growing.</p>
						<h2>Why watch art pictures online</h2>
						<p>The convenience from being able to watch art from wherever you are in the world both changes
							the way art is seen but also increases the quantity produced as the demand is becomes evergrowing.
						</p>
						<h2>What is art</h2>
						<p>For Plato art was nature, but in the 1900s photography took over the scene and in the 2000s abstract art went through the roof
							and transformed the meaning and usage of art into art being a representation. The questions still remains whether art needs to be beautiful,
							expressive, intellectual or skillful.
						</p> */}
				    <Link to={`/scroll/${this.props.category}`}>
				        <Button className="OTHER2" onClick={e=>this.props.categorySet(e.target.value)} value="Food">
								<h1>FOOD</h1>
				        </Button>

			        </Link>
							
							{/* <Link to="/scroll">
							 <Button onClick={e=>this.props.categorySet(e.target.value)} value="Food" 
							 className="smallText">Press here to watch FOOD content!</Button>
						  </Link>

							<h2>Food pictures online</h2>
							<p>Food is meant to be cooked, not viewed. However in the late 2000s cooking has grown as an art form 
								and thus presentation has become an important attribute when serving food.
							</p>
							<h2>Food online</h2>
							<p>Although the food can not be cooked online the cooking scene is large and there are popular internet personas making their living from cooking and posting videos and content of it on the internet.</p>
							<p></p> */}
			        <Link to={`/scroll/${this.props.category}`}>
				        <Button className="OTHER3" onClick={e=>this.props.categorySet(e.target.value)} value="Animals">
								<h1>ANIMALS</h1>
				        </Button>

			        </Link>
							{/* <Link to="/scroll">
							<Button onClick={e=>this.props.categorySet(e.target.value)} pan className="smallText">Press here to watch ANIMAL content!</Button>
							</Link>
							<br/>
							<h2>Watching animals pictures online</h2>
							<p>Cute animals... life, ey..? Watching animals online has for long been a lucrative thing to watch, this for a number of reasons.</p>
							<Link to="/#"> 
							<div className="rightCol">
							
							<br/><br/><br/><br/>
						<h2>About sliddit.com</h2>
						<p>The site for scrolling millions of pictures, gifs and videos that are acquired from different subreddits through the reddit API. Reddit is a forum which gives the user the possibility
						to scroll through posts, but not for pictures and videos / gifs specificly. Therefore this site was created
						to give the user the ability to fast scroll through different subreddits and find the pictures, videos and gifs that are hidden
						within the posts. This website is inspired from the website Nuttit which was shut down about a year ago. We are always
						looking to improve and would love any critizism that you can give. 
						</p>
						</div>
							</Link> */}
							
		      </div>
	       </div>
				 		
	       <div className="footerDiv"> 
				
				
	
			

	      	</div>
	    </div>
    );
  }
}

export default Startpage;




 