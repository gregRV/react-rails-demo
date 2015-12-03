# gets rid of root element when requesting comments json from api
ActiveModel::Serializer.root = false
ActiveModel::ArraySerializer.root = false