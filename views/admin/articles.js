var mongoose = require('mongoose');
var articleSchema = new mongoose.Schema({
	  article_name: String,
	  article_photo_path: String,
	  article_summary: String,
	  article_type: Boolean,
	  article_price: Number,
	  administrator_email_or_phone: String,
	  creation_date: {type:Date, default:Date.now},
	  parts:[{
		  content: String,
		  media:[{

		  text: String,
		  media_name: String,
		  media_kind: String,
		  media_path: String
		  }],
	  questions:[{
			question: String,
			media:[{
				  image_path: String,
				  truth: Boolean
			}]
		}]
		}]

});
mongoose.model('Article', articleSchema);
