<template>
	<scroll-view :style="{'background-color': currentThemeColor.backgroundColor}" scroll-y class="ss-slider">
		<block v-for="(item, index) in chapterList" :key="index">
			<view @click="chapterItemAction(index + 1)" class="chapter-item" :style="{'color': currentChapter ==  index + 1 ? '#449bda' : currentThemeColor.color}" :class="{'chapter-current-item': currentChapter ==  index}">
				<text>第{{item.sort}}章 {{item.name}}</text>
			</view>
			<view class="line" :style="{'background-color': currentThemeColor.borderColor}"></view>
		</block>
	</scroll-view>
</template>

<script>
	export default {
		name: 'ss-slider',
		props: {
			chapterList: {
				type: Array,
				default () {
					return [];
				}
			},
			index: {
				type: Number,
				default () {
					return 0;
				}
			},
			currentChapter: {
				type: Number,
				default () {
					return 0;
				}
			},
			isNightTheme: {
				type: Boolean,
				default () {
					return false;
				}
			}
			
		},
		computed: {
			currentThemeColor: function () {
				return this.isNightTheme ? this.nightThemeColor : this.dayThemeColor;
			}
		},
		data () {
			return {
				dayThemeColor: {
					backgroundColor: '#e4cba3',
					color: '#333',
					borderColor: '#f0f0f0'
				},
				nightThemeColor: {
					backgroundColor: '#333',
					color: '#808080',
					borderColor: '#808080'
				}
			}
		},
		methods: {
			chapterItemAction (index) {
				this.$emit('chapterItemTap', index);
			}
		}
	}
</script>

<style lang="scss">
	.ss-slider {
		height: 100%;
		display: flex;
		padding-top: 80upx;
		flex-direction: column;
		
		.line {
			margin: 0 10upx 0upx 30upx;
			height: 1px;
		}
		
		.chapter-item {
			padding: 20upx 30upx;
			font-size: $uni-font-size-lg;
		}
		
		.chapter-current-item {
			color: #449bda;
		}
	}
</style>
