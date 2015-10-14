package ar.com.leafnoise.services.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ar.com.leafnoise.services.ICommonService;

@Service
@Transactional
public class CommonService implements ICommonService {}