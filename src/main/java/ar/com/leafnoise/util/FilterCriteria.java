package ar.com.leafnoise.util;

import java.util.Iterator;

import org.hibernate.Criteria;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;
import org.hibernate.internal.CriteriaImpl;
import org.hibernate.internal.CriteriaImpl.Subcriteria;

public class FilterCriteria {
	
	public static final short EQUAL = 0;
	public static final short NOT_EQUAL = 1;
	public static final short LIKE_X = 2;
	public static final short X_LIKE = 3;
	public static final short X_LIKE_X = 4;
	public static final short GT = 5;
	public static final short LT = 6;
	public static final short LE = 7;
	public static final short GE = 8;
	public static final short IS_NULL = 9;
	public static final short LIKE = 10;
	public static final short IS_NOT_NULL = 11;
	
	private String propertyName;
	private short comparisionType;
	private Object propertyValue;
	
	public FilterCriteria(String propertyName, Object propertyValue, short comparisionType) {
		this.comparisionType = comparisionType;
		this.propertyName = propertyName;
		this.propertyValue = propertyValue;
	}
	
	public String getPropertyName() {
		return propertyName;
	}
	
	public void setPropertyName(String propertyName) {
		this.propertyName = propertyName;
	}
	
	public short getComparisionType() {
		return comparisionType;
	}
	
	public void setComparisionType(short comparisionType) {
		this.comparisionType = comparisionType;
	}
	
	public Object getPropertyValue() {
		return propertyValue;
	}
	
	public void setPropertyValue(Object propertyValue) {
		this.propertyValue = propertyValue;
	}
	
	public Criterion getCriterion(Criteria c) {
		String s = getFinalProperty(propertyName, c);
		if (comparisionType == EQUAL) {
			return Restrictions.eq(s, propertyValue);
		} 
		if (comparisionType == X_LIKE) {
			return Restrictions.ilike(s, propertyValue);
		} 
		if (comparisionType == LIKE_X) {
			return Restrictions.ilike(s, (String)propertyValue, MatchMode.END);
		} 
		if (comparisionType == X_LIKE_X) {
			return Restrictions.ilike(s, "%"+propertyValue+"%");
		} 
		if (comparisionType == LIKE) {
			return Restrictions.ge(s, propertyValue);
		} 
		if (comparisionType == GT) {
			return Restrictions.gt(s, propertyValue);
		} 
		if (comparisionType == LT) {
			return Restrictions.lt(s, propertyValue);
		}
		if (comparisionType == GE) {
			return Restrictions.ge(s, propertyValue);
		}
		if (comparisionType == LE) {
			return Restrictions.le(s, propertyValue);
		}
		if (comparisionType == IS_NULL) {
			return Restrictions.isNull(s);
		}
		if (comparisionType == IS_NOT_NULL) {
			return Restrictions.isNotNull(s);
		}
		return null;
	}
	
	private String getFinalProperty(String propertyName, Criteria c) {
		if (propertyName.contains(".")) {
			String[] split = propertyName.split("\\.");
			// verifica que ya no exista un alias igual para la criteria
			boolean duplicateAlias = false;
			Iterator<Subcriteria> it = ((CriteriaImpl)c).iterateSubcriteria();
			while (it.hasNext()) {
				if (it.next().getAlias().equals(split[0])) {
					duplicateAlias = true;
				}
			}
			if (!duplicateAlias) {
				c.createAlias(split[0], split[0]);
			}
			propertyName = split[0];
			for (int i=1; i<split.length-1; i++) {
				duplicateAlias = false;
				it = ((CriteriaImpl)c).iterateSubcriteria();
				while (it.hasNext()) {
					if (it.next().getAlias().equals(split[i])) {
						duplicateAlias = true;
					}
				}
				if (!duplicateAlias) {
					c.createAlias(propertyName + "." + split[i], split[i]);
					propertyName = split[i];
				} else {
					propertyName = split[i-1] + "." + split[i];
				}
			}
			propertyName = propertyName.substring(propertyName.indexOf(".") + 1, propertyName.length()) +  "." + split[split.length-1];
		}
		return propertyName;
	}
}