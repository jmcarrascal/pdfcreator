package ar.com.leafnoise.util;

import org.hibernate.Criteria;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;

public class CompositeFilterCriteria extends FilterCriteria {

	private short logicOperator;
	private FilterCriteria subcriteria;
	
	public static final short OR = 0;
	public static final short AND = 1;
	
	public CompositeFilterCriteria(String propertyName, Object propertyValue, short comparisionType, FilterCriteria subcriteria, short logicOperator) {
		super(propertyName, propertyValue, comparisionType);
		this.logicOperator = logicOperator;
		this.subcriteria = subcriteria;
	}
	
	public short getLogicOperator() {
		return logicOperator;
	}
	
	public void setLogicOperator(short logicOperator) {
		this.logicOperator = logicOperator;
	}

	public FilterCriteria getSubcriteria() {
		return subcriteria;
	}

	public void setSubcriteria(FilterCriteria subcriteria) {
		this.subcriteria = subcriteria;
	}
	
	public Criterion getCriterion(Criteria c) {
		if (logicOperator == OR) {
			return Restrictions.or(super.getCriterion(c), getSubcriteria().getCriterion(c));
		} else {
			return Restrictions.and(super.getCriterion(c), getSubcriteria().getCriterion(c));
		}
	}
}