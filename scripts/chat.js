// adding new caht documents
// setting up a real-time listeners to get new chats
// updating the username
// updating room

class Chatroom {
	constructor(room, username) {
		this.room = room;
		this.username = username;
		this.chats = db.collection('chats');
		this.unsub;
	}

	async addChat(message) {
		// format a chat object
		const now = new Date();
		const chat = {
			message,
			username : this.username,
			room : this.room,
			created_at : firebase.firestore.Timestamp.fromDate(now)
		};
		// save the chat document
		const response = await this.chats.add(chat);
		return response;
	}
	// setting up a real-time listeners to get new chats
	getChats(callback) {
		this.unsub = this.chats
			.where('room', '==', this.room)   // complex query
			.orderBy('created_at')
			.onSnapshot(snapshot => {
				snapshot.docChanges().forEach(change => {
					if (change.type === 'added') {
						// update the ui
						callback(change.doc.data());
					}
				});
			});
	}
	// updating the username
	updateName(username) {
		this.username = username;
	}
	// updating room
	updateRoom(room) {
		this.room = room;
		console.log('room updated');
		if (this.unsub) {
			this.unsub(); // unsubcribing to the changes
		}
	}
}

const chatroom = new Chatroom('general', 'masta');

chatroom.getChats((data) => {
	console.log(data);
});

setTimeout(() => {
	chatroom.updateRoom('gaming');
	chatroom.updateName('djuly');
	chatroom.getChats((data) => {
		console.log(data);
	});
	chatroom.addChat('Hola por ahí!');
}, 3000);