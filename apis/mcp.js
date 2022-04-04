const express = require('express');
const app = express();
const fs = require('fs');
const backendConfig = require('../fortnite.js');
const random = require('random');

function checkAndCreateProfile(AccountsountId) {
	if (
		!fs.existsSync(
			`${backendConfig.directory}/Accounts/profiles/${AccountsountId}.json`
		)
	) {
		fs.copyFileSync(
			`${backendConfig.directory}/Accounts/templates/config.json`,
			`${backendConfig.directory}/Accounts/profiles/${AccountsountId}.json`
		);
	}
}

function loadConfig(AccountsountId) {
	return JSON.parse(
		fs.readFileSync(
			`${backendConfig.directory}/Accounts/profiles/${AccountsountId}.json`
		)
	);
}

function loadProfile(profileId) {
	return JSON.parse(
		fs.readFileSync(
			`${backendConfig.directory}/Accounts/templates/profile_${profileId}.json`
		)
	);
}

function saveConfig(directory, AccountsountId, data) {
	fs.writeFileSync(
		`${directory}/Accounts/profiles/${AccountsountId}.json`,
		JSON.stringify(data, null, 2)
	);
}

// CREDITS TO AURORA & NEONITE FOR THIS IDEA
function createResponse(profileData, profileId, rvn) {
	return {
		profileRevision: rvn ? rvn - 0 + (1 - 0) : 1 || 1,
		profileId: profileId,
		profileChangesBaseRevision: Number(rvn) || 1,
		profileChanges: [
			{
				changeType: 'fullProfileUpdate',
				profile: profileData
			}
		],
		profileCommandRevision: rvn ? rvn - 0 + (1 - 0) : 1 || 1,
		serverTime: new Date().toISOString(),
		responseVersion: 1
	};
}

// Credits to Aurora
function createError(
	errorCode,
	errorMessage,
	numericErrorCode,
	originatingService,
	intent,
	messageVars
) {
	return {
		errorCode: errorCode,
		errorMessage: errorMessage,
		numericErrorCode: numericErrorCode,
		originatingService: originatingService,
		messageVars: messageVars || undefined,
		intent: intent || 'prod'
	};
}

function createCreative(AccountsountId, profile) {
	// Default

	profile.AccountsountId = AccountsountId;

	profile.created = new Date().toISOString();
	profile.updated = new Date().toISOString();

	profile.profileId = 'creative';

	return profile;
}

function createTheater0(AccountsountId, profile) {
	// Default

	profile.AccountsountId = AccountsountId;

	profile.created = new Date().toISOString();
	profile.updated = new Date().toISOString();

	profile.profileId = 'theater0';

	return profile;
}

function createCommonCore(config, AccountsountId, profile) {
	// Default

	profile._id = AccountsountId;
	profile.AccountsountId = AccountsountId;

	profile.created = new Date().toISOString();
	profile.updated = new Date().toISOString();

	profile.profileId = 'athena';

	// V-Bucks

	profile.items['Currency:MtxPurchased'].quantity = config.vbucks;
	profile.items['Currency:MtxPurchased'];

	// Stats

	profile.stats.attributes.mtx_affiliate = 'GKI';

	return profile;
}

function createCommonPublic(AccountsountId, profile) {
	// Default

	profile.AccountsountId = AccountsountId;

	profile.created = new Date().toISOString();
	profile.updated = new Date().toISOString();

	profile.profileId = 'athena';

	return profile;
}


function createCollections(AccountsountId, profile) {
	// Default
	profile.AccountsountId = AccountsountId;

	profile.created = new Date().toISOString();
	profile.updated = new Date().toISOString();

	profile.profileId = 'athena';

	return profile;
}

function createAthena(config, AccountsountId, profile) {
	// Default

	profile._id = AccountsountId;
	profile.AccountsountId = AccountsountId;

	profile.created = new Date().toISOString();
	profile.updated = new Date().toISOString();

	profile.version = 'Reezy';
	profile.profileId = 'athena';

	// Loadout

	var locker = profile.items.sandbox_loadout.attributes.locker_slots_data.slots;

	locker.MusicPack.items[0] = config.MusicPack.ID;
	locker.MusicPack.activeVariants = config.MusicPack.Variants;

	locker.Character.items[0] = config.Character.ID;
	locker.Character.activeVariants = config.Character.Variants;

	locker.Backpack.items[0] = config.Backpack.ID;
	locker.Backpack.activeVariants = config.Backpack.Variants;

	locker.SkyDiveContrail.items[0] = config.SkyDiveContrail.ID;
	locker.SkyDiveContrail.activeVariants = config.SkyDiveContrail.Variants;

	locker.Dance.items = config.Dance.ID;
	locker.Dance.activeVariants = config.Dance.Variants;

	locker.ItemWrap.items = config.ItemWrap.ID;
	locker.ItemWrap.activeVariants = config.ItemWrap.Variants;

	locker.Pickaxe.items[0] = config.Pickaxe.ID;
	locker.Pickaxe.activeVariants = config.Pickaxe.Variants;

	locker.LoadingScreen.items[0] = config.LoadingScreen.ID;
	locker.LoadingScreen.activeVariants = config.LoadingScreen.Variants;

	locker.Glider.items[0] = config.Glider.ID;
	locker.Glider.activeVariants = config.Glider.Variants;

	// Banner
	profile.items.sandbox_loadout.attributes.banner_icon_template =
		config.BannerIconTemplate;
	profile.items.sandbox_loadout.attributes.banner_color_template =
		config.BannerColorTemplate;

	profile.items.sandbox_loadout.attributes.locker_slots_data.slots = locker;

	// Stats

	var stats = profile.stats.attributes;

	stats.book_level = parseInt(config.level);
	stats.book_purchased = true;
	stats.lifetime_wins = random.int(1337, 666666);
	stats.level = parseInt(config.level, 10);
	stats.battlestars = parseInt(config.battlestars);
	stats.battlestars_season_total = parseInt(config.battlestars); // battle stars
	stats.alien_style_points = parseInt(config.alien_style_points); // alien artifacts
	stats.AccountsountLevel = parseInt(config.level);
	stats.season_num = backendConfig.season_num; // CHANGE THIS WHENEVER THERE IS A NEW SEASON

	profile.stats.attributes = stats;

	// Favorite

	var items = profile.items;

	for (var item of Object.keys(config.favorites)) {
		items[item['id']].attributes.favorite = true;
	}

	profile.items = items;

	return profile;
}

app.post(
	'/fortnite/api/game/v2/profile/:AccountsountId/client/:command',
	(req, res) => {
		const command = req.params.command;
		const AccountsountId = req.params.AccountsountId;

		const profileId = req.query.profileId;
		const rvn = req.query.rvn;

		checkAndCreateProfile(AccountsountId);

		let config = loadConfig(AccountsountId);
		let profile = loadProfile(profileId);

		switch (command) {
			case 'SetCosmeticLockerBanner':
				if (req.body.bannerIconTemplateName != 'None') {
					config.BannerIconTemplate = req.body.bannerIconTemplateName;
				}
				if (req.body.BannerColorTemplate != 'None') {
					config.BannerColorTemplate = req.body.bannerColorTemplateName;
				}
				saveConfig(backendConfig.directory, AccountsountId, config);
				res.json(
					createResponse(
						createAthena(config, AccountsountId, profile),
						profileId,
						rvn
					)
				);
				break;

			case 'ClientQuestLogin':
			case 'QueryProfile':
				switch (profileId) {
					case 'collections':
						res
							.json(
								createResponse(
									createCollections(config, AccountsountId, profile),
									profileId
								)
							)
							.end();
						break;

					case 'athena':
					case 'profile0':
						res
							.json(
								createResponse(
									createAthena(config, AccountsountId, profile),
									profileId
								)
							)
							.end();
						break;

					case 'creative':
						res
							.json(
								createResponse(createCreative(AccountsountId, profile), profileId)
							)
							.end();
						break;

					case 'common_core':
						res
							.json(
								createResponse(
									createCommonCore(config, AccountsountId, profile),
									profileId
								)
							)
							.end();
						break;

					case 'common_public':
						res
							.json(
								createResponse(
									createCommonPublic(AccountsountId, profile),
									profileId
								)
							)
							.end();
						break;

					case 'collection_book_schematics0':
					case 'collection_book_people0':
					case 'metadata':
          case 'theater0':
					case 'outpost0':
          case 'campaign':
					case 'metadata':
						res.json(createResponse([], profileId));
						break;

					default:
						res.json(
							createError(
								'errors.com.epicgames.modules.profiles.operation_forbidden',
								`Unable to find template configuration for profile ${
									req.query.profileId
								}`,
								12813,
								'fortnite',
								'prod-live',
								[req.query.profileId]
							)
						);
						break;
				}
				break;

			case 'SetMtxPlatform':
				res.json(
					createResponse(
						[
							{
								changeType: 'statModified',
								name: 'current_mtx_platform',
								value: req.body.platform
							}
						],
						profileId,
						rvn
					)
				);
				break;

			case 'VerifyRealMoneyPurchase':
                res.json(createResponse(createCommonCore(config, AccountsountId, profile), profileId, rvn));
                break;

      case 'ClaimMfaEnabled':
                rvn +=1;
                res.json(createResponse(createCommonCore(config, AccountsountId, profile), profileId, rvn));
                break;

			case 'SetItemFavoriteStatusBatch':
				let index = 0;
				for (item of req.body.itemIds) {
					if (req.body.itemFavStatus[index] === true) {
						var isAlreadyFavorized = false;
						for (item of config.favorites) {
							if (item.id === req.body.itemIds[index]) {
								isAlreadyFavorized = true;
								break;
							}
						}
						if (!isAlreadyFavorized) {
							config.favorites.push({ id: req.body.itemIds[index] });
						}
					} else {
						var index2 = 0;
						for (item of config.favorites) {
							if (item.id === req.body.itemIds[index]) {
								config.favorites.splice(index2, 1);
								break;
							}
							index2 += 1;
						}
					}
					index += 1;
				}
				saveConfig(backendConfig.directory, AccountsountId, config);
				res.json(
					createResponse(
						createAthena(config, AccountsountId, profile),
						profileId,
						rvn
					)
				);
				break;

			case 'SetCosmeticLockerSlot':
				const itemToSlot = req.body.itemToSlot;
				const indexSlot = req.body.slotIndex;
				const slotName = req.body.category;
				const variantUpdates = req.body.variantUpdates;

				switch (slotName) {
					case 'Character':
					case 'Backpack':
					case 'Pickaxe':
					case 'Glider':
					case 'SkyDiveContrail':
					case 'MusicPack':
					case 'LoadingScreen':
						config[slotName].ID = itemToSlot;
						config[slotName].Variants = [{ variants: variantUpdates }];

					case 'Dance':
						config[slotName].ID[indexSlot] = itemToSlot;
						config[slotName].Variants[indexSlot] = [
							{ variants: variantUpdates }
						];

					case 'ItemWrap':
						if (indexSlot != -1) {
							config[slotName].ID[indexSlot] = itemToSlot;
							config[slotName].Variants[indexSlot] = [
								{ variants: variantUpdates }
							];
						}
						// APPLY ALL
						else {
							config[slotName].ID[0] = itemToSlot;
							config[slotName].Variants[0] = [{ variants: variantUpdates }];
							config[slotName].ID[1] = itemToSlot;
							config[slotName].Variants[1] = [{ variants: variantUpdates }];
							config[slotName].ID[2] = itemToSlot;
							config[slotName].Variants[2] = [{ variants: variantUpdates }];
							config[slotName].ID[3] = itemToSlot;
							config[slotName].Variants[3] = [{ variants: variantUpdates }];
							config[slotName].ID[4] = itemToSlot;
							config[slotName].Variants[4] = [{ variants: variantUpdates }];
							config[slotName].ID[5] = itemToSlot;
							config[slotName].Variants[5] = [{ variants: variantUpdates }];
							config[slotName].ID[6] = itemToSlot;
							config[slotName].Variants[6] = [{ variants: variantUpdates }];
						}

						saveConfig(backendConfig.directory, AccountsountId, config);
						break;
				}
				var newAthena = createAthena(config, AccountsountId, profile);
				res.json(createResponse(newAthena, profileId, rvn));
				break;

			default:
				res.json(
					createError(
						'errors.com.epicgames.modules.profiles.operation_forbidden',
						`Unable to find template configuration for profile ${
							req.query.profileId
						}`,
						12813,
						'fortnite',
						'prod-live',
						[req.query.profileId]
					)
				);
				break;
		}
	}
);

module.exports = app;
