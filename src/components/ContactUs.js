import Subheader from './Subheader';
import '../stylesheets/ContactUs.css';
import { Button, TextField} from '@material-ui/core';
<Subheader path={['home', 'contact us']} />
function ContactUs() {
    return (
        <div className='contactUs'>
            <Subheader path={['home', 'contact us']} />
            <div className='contactUs__container'>
                <div className='contactUs__InfoContainer'>
                    <div className='contactUs__InfoContainerInput'>
                        <h6 className="font-bold">
                            Feel free to leave a message for us on any of your concerns or queries. We will try <br></br> our best to contact you back within 2 working days.
                        </h6>
                    </div>

                    <div className='contactUs__InfoContainerInput'>
                        <div>
                            YOUR NAME :
                        </div>
                        <div className='contactUs__InfoContainerInputName'>
                            <TextField placeholder="First Name"/>
                            <TextField placeholder="Last Name"/>
                        </div>
                    </div>

                    <div className='contactUs__InfoContainerInput'>
                        <div>
                            EMAIL ADDRESS :
                        </div>
                        <TextField placeholder="Email address"/>
                    </div>
                        
                    <div className='contactUs__InfoContainerInput'>
                        <div>
                            SUBJECT :
                        </div>
                        <TextField placeholder="Subject"/>
                    </div>
                
                </div>
                
                <div className='contactUs__MessageContainer'>
                    <div className='contactUs__MessageContainerInput'>
                        <div>
                            MESSAGE :
                        </div>
                        <TextField placeholder="Type your message here"/>
                        <div className='contactUs__buttoncontainer'>
                            <Button variant='contained' className='contactUs__button'>SEND</Button>
                        </div>
                    </div>      
                </div>
            </div>
        </div>
    );
}
export default ContactUs;