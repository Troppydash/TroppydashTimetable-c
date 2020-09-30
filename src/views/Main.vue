<template>
    <div class="content-container">
        <div class="header">
            <h1 class="big-text">STimetable</h1>
            <h5 class="sub-text">A Timetable Management Website</h5>
        </div>
        <div class="body">
            <div class="feature">
                <h5 class="sub-text">It contains...</h5>
            </div>
            <!-- features -->
            <div class="feature feature1">
                <h1 class="medium-text">Your Timetable</h1>
                <Timetable :onClick="handleClick" :selected-item="selectedItem" />
            </div>
            <div class="feature feature2">
                <h1 class="medium-text">And A Map</h1>
                <div class="map-wrapper">
                    <SchoolMap ref="map" />
                </div>
            </div>

            <div class="feature">
                <h1 class="medium-text">You can...</h1>

                <h5 class="sub-text">Read about the spaghetti code <a href="https://github.com/Troppydash/TroppydashTimetable-c">here</a></h5>
                <h5 class="sub-text">Or try the website out <router-link to="register">here</router-link></h5>
            </div>
            <div class="feature">
                Have fun :)
            </div>
        </div>
    </div>
</template>

<script>
    import SchoolMap from '@/components/MainViewComponents/SchoolMap';
    import Timetable from '@/components/MainViewComponents/Timetable';

    export default {
        name: 'Main' ,
        components: { Timetable , SchoolMap } ,
        data() {
            return {
                selectedItem: '' ,
            }
        },
        methods:  {
            handleClick( code , item ) {
                if (!code) {
                    return;
                }
                this.selectedItem = item;
                this.$refs.map.focusObject(code);
            } ,
        },
    };
</script>

<style scoped lang="scss">
    .content-container {
        margin: 50px 20px;
    }

    .header {
        text-align: center;
        margin: 0 0 5rem ;
    }

    .body {

    }

    .feature {
        width: 80%;
        margin: 3rem auto;
    }

    .map-wrapper {
        width: auto;
    }

    .feature2 {
        text-align: left;
    }

    @media only screen and (max-width: 1023px) {
        .feature {
            width: 100%;
            margin: 20px auto;
        }

        .big-text {
            font-size: 4rem;
        }

        .medium-text {

            font-size: 2rem;
        }

        .sub-text {

            font-size: 1rem;
        }
    }
</style>
