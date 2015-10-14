package ar.com.leafnoise.dao;

import java.io.Serializable;
import java.util.List;

import org.springframework.dao.DataAccessException;

import ar.com.leafnoise.util.FilterCriteria;

public interface IGenericDAO<T> {

	public Serializable save(T newInstance) throws DataAccessException;

	public void update(T persistenceInstance) throws DataAccessException;

	public void remove(T persistenceInstance) throws DataAccessException;

	public List<T> getAll() throws DataAccessException;
	
	public List<T> getAll(String[] propertyNameOrder) throws DataAccessException;
	
	public long getCount() throws DataAccessException;
	
	public long getCount(List<FilterCriteria> filters) throws DataAccessException;
	
	public List<T> getAll(int displayStart, String displayLength, String sortDirection, List<FilterCriteria> filters) throws DataAccessException;
	
	public List<T> getAll(int displayStart, String displayLength, String sortDirection, List<FilterCriteria> filters, List<String> joinProperties) throws DataAccessException;

	public List<T> getAll(int displayStart, String displayLength, String[] propertiesNamesOrder, String[] sortDirections, List<FilterCriteria> filters) throws DataAccessException;
	
	public List<T> getAll(int displayStart, String displayLength, String[] propertiesNamesOrder, String[] sortDirections, List<FilterCriteria> filters, List<String> joinProperties) throws DataAccessException;

	public List<T> getAll(List<FilterCriteria> filters) throws DataAccessException;

	public List<T> getAll(String[] propertyNameOrder, List<FilterCriteria> filters) throws DataAccessException;
	
	public T getByPrimaryKey(Serializable id) throws DataAccessException;

	public void saveOrUpdate(T newInstance) throws DataAccessException;
	
	public void removeAll() throws DataAccessException;
	
	public void detachInstance(Object object);
	
	public void flush();
}
