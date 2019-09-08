<template>
    <div v-if="successText" class="SuccessMessage">
        <div class="container">
            <div class="row">
                <div class="col-sm-6 offset-sm-3">
                    <div class="alert alert-success">{{successText}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import store from '../../store';
    export default {
        name: 'SuccessRegistration',
        data () {
            return {
                successText: (store.getters.successMessage ? store.getters.successMessage : false),
            }
        }
    };
</script>