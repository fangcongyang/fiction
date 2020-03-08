<template>
	<view :style="{'background-color': currentThemeColor.backgroundColor, 'border-top': '1px solid' + currentThemeColor.borderColor}" class="ss-toolbar" :class="{'ss-night-toolbar': isNight}">
		<view class="tool-top">
			<view class="title-section">
				<text :style="{'color': currentThemeColor.color}">{{chapter.name}}</text>
			</view>
			<view class="chapter-section">
				<button :style="{'color': currentThemeColor.color}" @click="chapterBtnAction('pre')" class="pre-btn" type="primary">上一章</button>
				<block v-if="!isNight">
					<slider activeColor="#000" block-color="#000" block-size="20" backgroundColor="#f0f0f0" class="chapter-slider" show-value="true" :max=chapter.size :value=chapter.sort @change="sliderChange" step="1" />
				</block>
				<block v-else>
					<slider activeColor="#808080" block-color="#808080" block-size="20" backgroundColor="gray" class="chapter-slider" show-value="true" :max=chapter.size :value=chapter.sort @change="sliderChange" step="1" />
				</block>
				<button :style="{'color': currentThemeColor.color}" @click="chapterBtnAction('next')" class="next-btn" type="primary">下一章</button>
			</view>
		</view>
		<view :style="{'background-color': currentThemeColor.borderColor}" class="line"></view>
		<view class="tool-bottom">
			<view @click="toolAction('chapters')" class="function-section">
				<view class="function-item">
					<view :style="{'color': currentThemeColor.color}" class="iconfont iconcatalog"></view>
					<text :style="{'color': currentThemeColor.color}">目录</text>
				</view>
			</view>
			<view @click="toolAction('set')" class="function-section">
				<view class="function-item">
					<view :style="{'color': currentThemeColor.color}" class="iconfont iconshezhi"></view>
					<text :style="{'color': currentThemeColor.color}">设置</text>
				</view>
			</view>
			<view @click="themeAction" class="function-section">
				<view class="function-item">
					<block v-if="!isNight">
						<view :style="{'color': currentThemeColor.color}" class="iconfont iconyejian"></view>
						<text :style="{'color': currentThemeColor.color}">夜间</text>
					</block>
					<block v-else>
						<view :style="{'color': currentThemeColor.color}" class="iconfont iconbaitian"></view>
						<text :style="{'color': currentThemeColor.color}">白天</text>
					</block>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'ss-toolbar',
		props: {
			chapter: {
				type: Object,
				default () {
					return {};
				}
			}
		},
		computed: {
			currentThemeColor: function () {
				return this.isNight ? this.nightThemeColor : this.dayThemeColor;
			}
		},
		data () {
			return {
				isNight: false,
				dayThemeColor: {
					backgroundColor: '#e4cba3',
					color: '#000',
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
			chapterBtnAction (btnType) {
				this.$emit('chapterBtnTap', btnType);
			},
			toolAction (toolType) {
				this.$emit('functionBtnTap', toolType);
			},
			themeAction () {
				this.isNight = !this.isNight;
				this.$emit('themeTap', this.isNight);
			},
			sliderChange (e) {
				let value = e.detail.value;
				this.$emit('toolSliderChange', value);
			}
		}
	}
</script>

<style lang="scss">
	%flex-center {
		display:flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	
	.ss-toolbar {
		height: 100%;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		border-top: 1px solid $uni-border-color;
		
		.line {
			margin: 0 30upx;
			height: 1px;
		}
		
		.tool-top {
			height: 60%;
			
			.title-section {
				display: flex;
				justify-content: center;
				align-items: center;
				padding-top: 20upx;
				font-size: $uni-font-size-lg;
				font-weight: 500;
			}	
			
			.chapter-section {
				display: flex;
				justify-content: flex-start;
				align-items: center;
				
				.pre-btn, .next-btn {					
					color: #000;
					background-color: transparent;
					font-size: $uni-font-size-lg;
					margin: 0upx 20upx;
				}
				
				.chapter-slider {
					flex: 1;
				}
			}
		}
		
		.tool-bottom {
			height: 40%;
			display: flex;
			
			.function-section {
				width: calc(100% / 3);
				display: flex;
				justify-content: center;
				align-items: center;
				
				&:first-child {
					justify-content: flex-start;
					padding-left: 30upx;
				}
				
				&:last-child {
					justify-content: flex-end;
					padding-right: 30upx;
				}
				
				.function-item {
					@extend %flex-center;
					
					text {
						margin-top: 5upx;
						font-size: $uni-font-size-base;
					}
				}
			}
		}
	}
</style>
