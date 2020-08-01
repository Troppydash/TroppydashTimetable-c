<template>
    <div>
        <div v-for="commit in commits" :key="commit.sha" class="item">
            <span>{{ getDate(commit.commit.author.date) }}</span>
            <span>:</span>
            <div>{{ commit.commit.message }}</div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import moment from 'moment';

    const branch = 'dev';
    const url = `https://api.github.com/repos/troppydash/TroppydashTimetable-c/commits?sha=${ branch }&per_page=10`;

    export default {
        name: 'PastCommits' ,
        data() {
            return {
                commits: []
            };
        } ,
        methods: {
            fetchCommits() {
                axios.get(url)
                    .then(res => {
                        this.commits = res.data;
                    })
                    .catch(err => {
                        console.error('Cannot fetch github commits' , err);
                    });
            },
            getDate(date) {
                return moment(date).format('DD/mm/YYYY').toString();
            }
        } ,
        mounted() {
            this.fetchCommits();
        }
    };
</script>

<style scoped>
    .item {
        margin: 10px 0;
        border-bottom: 2px solid var(--scots-red);
    }
</style>
