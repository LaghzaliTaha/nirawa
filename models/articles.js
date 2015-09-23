var mongoose = require('mongoose');
var articleSchema = new mongoose.Schema({

	  id_article: Number,
	  article_name: String,
	  article_summary: String,
	  article_type: Boolean,
	  article_image : String,
	  administrator_email_or_phone: Number,
	  creation_date: {type:Date,default: Date.now},
	  parts:[{
		  id_part: Number,
		  content: String,
		  media:[{
		  id_media: String,
		  text: String,
		  media_name: String,
		  media_kind: String,
		  media_path: String
		  }],
	  questions:[{
			id_question: Number,
			question: String,
			media:[{
				  id_media: Number,
				  image_path: String,
				  truth: Boolean
			}]
		}]
		}]

});
mongoose.model('article', articleSchema);
