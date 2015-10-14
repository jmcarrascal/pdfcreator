package ar.com.leafnoise.dao.impl;

import java.io.Serializable;
import java.util.Iterator;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.FetchMode;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Projections;
import org.hibernate.internal.CriteriaImpl;
import org.hibernate.internal.CriteriaImpl.Subcriteria;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Repository;

import ar.com.leafnoise.dao.IGenericDAO;
import ar.com.leafnoise.util.Constants;
import ar.com.leafnoise.util.FilterCriteria;

@Repository
public abstract class GenericDAO<T> implements IGenericDAO<T> {

	private Class<T> objectType;

	@Autowired
	protected SessionFactory sessionFactory;

	public GenericDAO() {
		super();
	}

	public GenericDAO(Class<T> objectType) {
		this.objectType = objectType;
	}

	protected abstract String[] getDefaultOrderCriteria();

	public List<T> getAll() throws DataAccessException {
		return getAll(getDefaultOrderCriteria());
	}

	@SuppressWarnings("unchecked")
	public List<T> getAll(String[] propertyNameOrder)
			throws DataAccessException {
		Criteria c = sessionFactory.getCurrentSession().createCriteria(
				objectType);
		String order;
		for (String pn : propertyNameOrder) {
			order = setOrder(c, pn);
			c.addOrder(Order.asc(order));
		}
		return c.list();
	}

	public long getCount() throws DataAccessException {
		return (Long) (sessionFactory.getCurrentSession()
				.createCriteria(objectType)
				.setProjection(Projections.rowCount()).uniqueResult());
	}

	public long getCount(List<FilterCriteria> filters)
			throws DataAccessException {
		Criteria c = sessionFactory.getCurrentSession().createCriteria(
				objectType);
		setFilters(filters, c);
		return (Long) (c.setProjection(Projections.rowCount()).uniqueResult());
	}

	public List<T> getAll(int displayStart, String displayLength,
			String sortDirection, List<FilterCriteria> filters)
			throws DataAccessException {
		String[] sortDirections = { sortDirection };
		return getAll(displayStart, displayLength, getDefaultOrderCriteria(),
				sortDirections, filters, null);
	}

	public List<T> getAll(int displayStart, String displayLength,
			String sortDirection, List<FilterCriteria> filters,
			List<String> joinProperties) throws DataAccessException {
		String[] sortDirections = { sortDirection };
		return getAll(displayStart, displayLength, getDefaultOrderCriteria(),
				sortDirections, filters, joinProperties);
	}

	public List<T> getAll(int displayStart, String displayLength,
			String[] propertiesNameOrder, String[] sortDirections,
			List<FilterCriteria> filters) throws DataAccessException {
		return this.getAll(displayStart, displayLength, propertiesNameOrder,
				sortDirections, filters, null);
	}

	@SuppressWarnings("unchecked")
	public List<T> getAll(int displayStart, String displayLength,
			String[] propertiesNamesOrder, String[] sortDirections,
			List<FilterCriteria> filters, List<String> joinProperties)
			throws DataAccessException {
		Criteria c = sessionFactory.getCurrentSession().createCriteria(
				objectType);
		setFilters(filters, c);
		String order;
		for (int i = 0; i < propertiesNamesOrder.length; i++) {
			order = setOrder(c, propertiesNamesOrder[i]);
			c.addOrder(sortDirections[i].equals("asc") ? Order.asc(order)
					: Order.desc(order));
		}
		if (joinProperties != null && joinProperties.size() > 0) {
			for (String s : joinProperties) {
				c.setFetchMode(s, FetchMode.JOIN);
			}
		}
		// trata la paginacion
		if (!displayLength.equals(Constants.ALL_RECORDS)) {
			c.setMaxResults(Integer.parseInt(displayLength));
		}
		c.setFirstResult(displayStart);

		return c.list();
	}

	public List<T> getAll(List<FilterCriteria> filters)
			throws DataAccessException {
		return getAll(getDefaultOrderCriteria(), filters);
	}

	@SuppressWarnings("unchecked")
	public List<T> getAll(String[] propertyNameOrder,
			List<FilterCriteria> filters) throws DataAccessException {
		Criteria c = sessionFactory.getCurrentSession().createCriteria(
				objectType);
		setFilters(filters, c);
		String order;
		if (propertyNameOrder != null) {
			for (String pn : propertyNameOrder) {
				order = setOrder(c, pn);
				c.addOrder(Order.asc(order));
			}
		}
		return c.list();
	}

	protected void setFilters(List<FilterCriteria> filters, Criteria c) {
		for (FilterCriteria f : filters) {
			c.add(f.getCriterion(c));
		}
	}

	@SuppressWarnings("unchecked")
	private String setOrder(Criteria c, String propertyName) {
		if (propertyName.contains(".")) {
			String[] split = propertyName.split("\\.");
			// verifica que ya no exista un alias igual para la criteria
			boolean duplicateAlias = false;
			Iterator<Subcriteria> it = ((CriteriaImpl) c).iterateSubcriteria();
			while (it.hasNext()) {
				if (it.next().getAlias().equals(split[0])) {
					duplicateAlias = true;
				}
			}
			if (!duplicateAlias) {
				c.createAlias(split[0], split[0]);
			}
			propertyName = split[0];
			for (int i = 1; i < split.length - 1; i++) {
				duplicateAlias = false;
				it = ((CriteriaImpl) c).iterateSubcriteria();
				while (it.hasNext()) {
					if (it.next().getAlias().equals(split[i])) {
						duplicateAlias = true;
					}
				}
				if (!duplicateAlias) {
					c.createAlias(propertyName + "." + split[i], split[i]);
					propertyName = split[i];
				} else {
					propertyName = split[i - 1] + "." + split[i];
				}
			}
			propertyName = propertyName.substring(
					propertyName.indexOf(".") + 1, propertyName.length())
					+ "."
					+ split[split.length - 1];
		}
		return propertyName;
	}

	@SuppressWarnings("unchecked")
	public T getByPrimaryKey(Serializable id) throws DataAccessException {
		return (T) sessionFactory.getCurrentSession().get(objectType.getName(),
				id);
	}

	public void remove(T persistenceInstance) throws DataAccessException {
		sessionFactory.getCurrentSession().delete(persistenceInstance);
	}

	public Serializable save(T newInstance) {
		return sessionFactory.getCurrentSession().save(newInstance);
	}

	public void update(T persistenceInstance) throws DataAccessException {
		sessionFactory.getCurrentSession().update(persistenceInstance);
	}

	public void saveOrUpdate(T newInstance)
			throws DataIntegrityViolationException {
		sessionFactory.getCurrentSession().saveOrUpdate(newInstance);
	}

	@Override
	public void removeAll() throws DataAccessException {
		// TODO ver como eliminar Todo de una vez!
		@SuppressWarnings("unchecked")
		List<T> entities = (List<T>) sessionFactory.getCurrentSession()
				.createCriteria(objectType).list();
		for (T elem : entities) {
			this.remove(elem);
		}
	}

	@Override
	public void detachInstance(Object object) {
		sessionFactory.getCurrentSession().evict(object);
	}

	public void flush() {
		sessionFactory.getCurrentSession().flush();
	}

}
