/* © 2017 NauStud.io
 * @author Thanh
 */
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const songSchema = new SimpleSchema({
	timeAdded: {
		type: Number,
		label: 'Created timestamp, not Date object',
	},
	originalURL: {
		type: String,
	},
	origin: {
		type: String,
		allowedValues: ['Soundcloud', 'NCT', 'Zing', 'YouTube'],
	},
	name: {
		type: String,
	},
	artist: {
		type: String,
		label: 'Artist or Uploader for YouTube',
	},
	streamURL: {
		type: String,
	},
	thumbURL: {
		type: String,
	},
	play: {
		type: Number,
	},
	lyric: {
		type: String,
		optional: true,
	},
	author: {
		type: String,
	},
	searchPattern: {
		type: String,
	},
});

const Songs = new Mongo.Collection('songs');
Songs.attachSchema(songSchema);

const AppStates = new Mongo.Collection('appstates');
const Users = Meteor.users;

/**
 * AppStates helper: update playing songs, from any clients
 *
 * NOTE: this is an extremely naive solution to show playing state of songs
 * Any clients will override the playing state and there are high chance
 * playing states are not cleaned up properly
 *
 * This is temporary solution, until I manage to upgrade this app
 * to Meteor 1.2+ and integrate a more sophisticated users managing
 *
 * @param  {String} played  next play song ID
 * @param  {String} stopped previously played, and now stopped song ID
 * @return {void}
 */
AppStates.updatePlayingSongs = function(played, stopped) {
	const playingSongs = AppStates.find({ key: 'playingSongs' });

	if (!playingSongs) {
		return;
	}

	let songs = playingSongs.songs;

	if (!Array.isArray(songs)) {
		songs = playingSongs.songs = [];
	}

	const removedIdx = songs.indexOf(stopped);

	if (removedIdx !== -1) {
		songs.splice(removedIdx, 1);
	}

	if (songs.indexOf(played) === -1) {
		songs.push(played);
	}

	// update the exact document in AppStates collection with new songs array
	AppStates.update(playingSongs._id, { key: 'playingSongs', songs });
};

export { Songs, AppStates, Users };
