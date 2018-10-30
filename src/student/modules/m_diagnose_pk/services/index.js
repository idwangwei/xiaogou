/**
 * Created by ZL on 2018/1/4.
 */
import diagnosePkService from './diagnose_pk_service'

let services = angular.module('m_diagnose_pk.services', []);
services.service('diagnosePkService',diagnosePkService);