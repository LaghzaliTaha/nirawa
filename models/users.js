var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
  email_or_phone: String,
  idFacebook : String,
  password: String,
  first_name: String,
  last_name: String,
  birthday: {type:Date, default:Date.now},
  scholar_level: String,
  city: String,
  school_name: String,
  school_status: Boolean,
  articles:[{
	  id_article: Number,
	  parts:[{
		  id_part: Number,
		  media:[{
		  id_media: String
		  }],
	  questions:[{
			id_question: Number,
			essai_number: Number,
			truth: Boolean,
			media:[{
				  id_media: Number
				}]
		}]
		}]
  }],
   payements:[{
	      id_payment: Number,
		  id_article: Number,
		  date_payment: {type:Date, default: Date.now},
		  amount: Number,
		  payment_way: String
   }]
});
mongoose.model('User', userSchema);
